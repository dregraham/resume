const crypto = require("crypto");

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.CORS_ALLOW_ORIGIN || "*",
  "Access-Control-Allow-Headers": "Content-Type,x-api-key",
  "Access-Control-Allow-Methods": "POST,OPTIONS"
};

exports.handler = async (event = {}) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders };
  }

  if (event.httpMethod && event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Method Not Allowed" })
    };
  }

  const token = process.env.GITHUB_WORKFLOW_TOKEN;
  if (!token) {
    console.error("GITHUB_WORKFLOW_TOKEN environment variable is not set");
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Server misconfiguration" })
    };
  }

  let body = {};
  try {
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64").toString("utf8")
      : event.body || "";
    body = rawBody ? JSON.parse(rawBody) : {};
  } catch (error) {
    console.error("Failed to parse request body", error);
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Invalid JSON payload" })
    };
  }

  const owner = process.env.GITHUB_OWNER || "dregraham";
  const repo = process.env.GITHUB_REPO || "resume";
  const eventType = process.env.GITHUB_EVENT_TYPE || "terraform-provision";
  const defaultRegion = process.env.DEFAULT_REGION || "us-east-2";

  const mode = body.mode === "destroy" ? "destroy" : "provision";
  const region = body.region || defaultRegion;
  const requestId = body.requestId || crypto.randomUUID();
  const stateKey = body.stateKey || `multicloud-iac/aws/${requestId}.tfstate`;

  const clientPayload = {
    request_id: requestId,
    aws_region: region,
    mode,
    state_key: stateKey
  };

  let response;
  try {
    response = await fetch(`https://api.github.com/repos/${owner}/${repo}/dispatches`, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "terraform-dispatch-lambda"
      },
      body: JSON.stringify({
        event_type: eventType,
        client_payload: clientPayload
      })
    });
  } catch (error) {
    console.error("GitHub dispatch request failed", error);
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Unable to reach GitHub API",
        details: error.message
      })
    };
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error("GitHub dispatch failed", response.status, errorText);
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Failed to dispatch workflow",
        status: response.status,
        details: errorText
      })
    };
  }

  return {
    statusCode: 202,
    headers: corsHeaders,
    body: JSON.stringify({
      requestId,
      stateKey,
      mode,
      region
    })
  };
};
