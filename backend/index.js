// backend/index.js
import crypto from "crypto";
import fetch from "node-fetch";
import { DynamoDBClient, PutItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";

const db = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-2" });
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://dregraham.com",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  "Access-Control-Allow-Headers": "Content-Type,x-api-key",
  "Access-Control-Max-Age": "86400",
};

const respond = (statusCode, body) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify(body),
});

export const handler = async (event = {}) => {
  const method = event.httpMethod || event.requestContext?.http?.method;

  if (method === "OPTIONS") return { statusCode: 200, headers: corsHeaders };

  const apiKey = process.env.API_KEY;
  const reqKey = event.headers?.["x-api-key"];
  if (!apiKey || reqKey !== apiKey) return respond(403, { message: "Forbidden" });

  if (method === "GET") {
    const runId = event.queryStringParameters?.runId;
    if (!runId) return respond(400, { message: "Missing runId" });

    const item = await db.send(
      new GetItemCommand({
        TableName: process.env.RUN_TABLE,
        Key: { runId: { S: runId } },
      })
    );
    if (!item.Item) return respond(404, { message: "Run not found" });
    return respond(200, {
      runId,
      status: item.Item.status.S,
      logs: item.Item.logs?.S || "",
    });
  }

  if (method === "POST") {
    let body = {};
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return respond(400, { message: "Invalid JSON" });
    }

    const action = body.action === "destroy" ? "destroy" : "apply";
    const clouds = Array.isArray(body.clouds) ? body.clouds : ["aws"];
    const runId = crypto.randomUUID();

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

    await fetch(`https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/dispatches`, {
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

    return respond(202, { runId, status: "queued" });
  }

  return respond(405, { message: "Method Not Allowed" });
};
