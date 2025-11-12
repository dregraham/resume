// backend/index.js
import crypto from "crypto";
import fetch from "node-fetch";
import { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const db = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-2" });

// Allow production domain + any ephemeral GitHub Codespaces / github.dev preview origins (pattern based).
// For a stricter production posture, replace pattern logic with a static allow-list and remove wildcard acceptance.
const isAllowedOrigin = (origin) => {
  if (!origin) return false;
  if (origin === "https://dregraham.com") return true;
  // Permit GitHub preview subdomains: https://<random>.<port>.app.github.dev OR https://<workspace>-<port>.github.dev
  if (/https:\/\/[-a-z0-9]+.*github\.dev$/.test(origin)) return true;
  return false;
};

const buildCorsHeaders = (origin) => {
  // If origin allowed, echo it back; otherwise default to prod domain (still functional for non-browser clients)
  const allowOrigin = isAllowedOrigin(origin) ? origin : "https://dregraham.com";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    "Access-Control-Allow-Headers": "Content-Type,x-api-key",
    "Access-Control-Max-Age": "86400",
  };
};

const respond = (statusCode, body, origin) => ({
  statusCode,
  headers: buildCorsHeaders(origin),
  body: JSON.stringify(body),
});

export const handler = async (event = {}) => {
  const method = event.httpMethod || event.requestContext?.http?.method;
  const origin = event.headers?.origin || event.headers?.Origin; // headers may vary in casing

  if (method === "OPTIONS") return { statusCode: 200, headers: buildCorsHeaders(origin) };

  const apiKey = process.env.API_KEY;
  const reqKey = event.headers?.["x-api-key"];
  if (!apiKey || reqKey !== apiKey) return respond(403, { message: "Forbidden" }, origin);

  if (method === "GET") {
    const runId = event.queryStringParameters?.runId;
  if (!runId) return respond(400, { message: "Missing runId" }, origin);

    if (!process.env.RUN_TABLE) {
      return respond(500, { message: "Server misconfiguration: RUN_TABLE env var not set" }, origin);
    }

    const item = await db.send(
      new GetItemCommand({
        TableName: process.env.RUN_TABLE,
        Key: { runId: { S: runId } },
      })
    );
    if (!item.Item) return respond(404, { message: "Run not found" }, origin);
    return respond(200, {
      runId,
      status: item.Item.status.S,
      logs: item.Item.logs?.S || "",
    }, origin);
  }

  if (method === "POST") {
    let body = {};
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return respond(400, { message: "Invalid JSON" }, origin);
    }

    const action = body.action === "destroy" ? "destroy" : "apply";
    const clouds = Array.isArray(body.clouds) ? body.clouds : ["aws"];
    const runId = crypto.randomUUID();

    if (!process.env.RUN_TABLE) {
      return respond(500, { message: "Server misconfiguration: RUN_TABLE env var not set" }, origin);
    }
    if (!process.env.GITHUB_OWNER || !process.env.GITHUB_REPO || !process.env.GITHUB_WORKFLOW_TOKEN) {
      return respond(500, { message: "Server misconfiguration: Missing GitHub dispatch environment variables" }, origin);
    }

    await db.send(
      new PutItemCommand({
        TableName: process.env.RUN_TABLE,
        Item: {
          runId: { S: runId },
          status: { S: "queued" },
          clouds: { S: clouds.join(",") },
          createdAt: { S: new Date().toISOString() },
        },
      })
    );

    const ghResp = await fetch(`https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/dispatches`, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_WORKFLOW_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: "terraform_on_demand",
        client_payload: {
          runId,
          action,
          clouds,
        },
      }),
    });

    if (!ghResp.ok) {
      // Capture brief error text (avoid huge bodies) and mark run as dispatch_failed so UI can surface it.
      let errText = `${ghResp.status}`;
      try { errText += ` ${await ghResp.text()}`.slice(0, 500); } catch {}
      await db.send(
        new UpdateItemCommand({
          TableName: process.env.RUN_TABLE,
          Key: { runId: { S: runId } },
          UpdateExpression: "SET #s = :s, logs = :l",
          ExpressionAttributeNames: { "#s": "status" },
          ExpressionAttributeValues: {
            ":s": { S: "dispatch_failed" },
            ":l": { S: `GitHub dispatch failed: ${errText}` },
          },
        })
      );
      return respond(500, { runId, status: "dispatch_failed", message: "GitHub dispatch failed" }, origin);
    }

    return respond(202, { runId, status: "queued" }, origin);
  }

  return respond(405, { message: "Method Not Allowed" }, origin);
};
