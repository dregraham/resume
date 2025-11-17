
# Terraform Dispatch Lambda

This AWS Lambda function acts as a secure HTTPS API endpoint to trigger infrastructure automation workflows in GitHub. When called, it emits a `repository_dispatch` event to GitHub, passing metadata that launches a Terraform workflow (provision or destroy) in the target repository.

## What Does This Lambda Do?

- Accepts POST requests from your front-end or automation tools.
- Validates and parses the request body for deployment parameters (region, mode, requestId, stateKey).
- Emits a `repository_dispatch` event to GitHub, triggering a workflow that provisions or destroys AWS infrastructure using Terraform.
- Returns a response with the request details for tracking.

## How It Works

1. **API Gateway Integration**: Attach the Lambda to an HTTPS endpoint (API Gateway HTTP API recommended). Secure the endpoint with an API key, IAM, or Cognito.
2. **Request Handling**: Accepts only POST requests with a JSON body. OPTIONS requests are handled for CORS preflight.
3. **Dispatch to GitHub**: Uses a GitHub token to send a `repository_dispatch` event to the configured repo and owner.
4. **Response**: Returns `202 Accepted` with `{ requestId, stateKey, mode, region }`.

## Environment Variables

- `GITHUB_WORKFLOW_TOKEN` – GitHub token (PAT or App token) with `repo` and `workflow` scopes.
- `GITHUB_OWNER` – GitHub username/org (default: `dregraham`).
- `GITHUB_REPO` – Repository name (default: `resume`).
- `GITHUB_EVENT_TYPE` – Event type for dispatch (default: `terraform-provision`).
- `DEFAULT_REGION` – Default AWS region (default: `us-east-2`).
- `CORS_ALLOW_ORIGIN` – Allowed origin for CORS (default: `*`).

## Request Format

POST body:
```json
{
  "region": "us-east-2",            // optional, overrides DEFAULT_REGION
  "mode": "provision" | "destroy", // optional, defaults to provision
  "requestId": "<uuid>",            // optional, for tracking
  "stateKey": "multicloud-iac/aws/<uuid>.tfstate" // optional, backend key
}
```

## Response Format

Returns HTTP 202 with:
```json
{
  "requestId": "...",
  "stateKey": "...",
  "mode": "provision" | "destroy",
  "region": "us-east-2"
}
```

## What Gets Sent to GitHub

Dispatches:
```json
{
  "event_type": "terraform-provision",
  "client_payload": {
    "request_id": "...",
    "aws_region": "...",
    "mode": "provision" | "destroy",
    "state_key": "multicloud-iac/aws/..."
  }
}
```

## Security Best Practices

- Store your GitHub token securely (AWS Secrets Manager recommended).
- Protect the API Gateway endpoint (API keys, WAF, throttling).
- Validate requests if exposing publicly (origin allow-list, HMAC signatures).

## Front-End Integration

Your React front-end should use:

- `REACT_APP_TERRAFORM_TRIGGER_URL` – HTTPS endpoint for this Lambda/API Gateway.
- `REACT_APP_TERRAFORM_TRIGGER_API_KEY` – Optional API key header (`x-api-key`).
- `REACT_APP_TERRAFORM_REGION` – Region override for dispatch payloads.

When a user clicks **Create Environment**, the front-end sends a POST to the Lambda endpoint, receives a request ID, and displays it while the GitHub Actions workflow provisions and destroys the AWS environment.
