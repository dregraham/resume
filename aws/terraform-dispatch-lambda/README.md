# Terraform Dispatch Lambda

This AWS Lambda function exposes a lightweight HTTPS endpoint that triggers the on-demand Terraform workflow in this repository. It emits a `repository_dispatch` event to GitHub, passing the request metadata that the workflow uses to run `terraform apply`, wait, and then run `terraform destroy`.

## Deployment Overview

1. **Create the Lambda function** (Node.js 18 runtime is recommended).
2. **Upload `index.js`** from this folder as the Lambda handler (`index.handler`).
3. **Set environment variables**:
   - `GITHUB_WORKFLOW_TOKEN` – GitHub token (classic PAT or GitHub App installation token) with the `repo` and `workflow` scopes.
   - `GITHUB_OWNER` – defaults to `dregraham` if omitted.
   - `GITHUB_REPO` – defaults to `resume` if omitted.
   - `GITHUB_EVENT_TYPE` – defaults to `terraform-provision`; keep aligned with the workflow trigger.
   - `DEFAULT_REGION` – default AWS region (matches the Terraform backend).
   - `CORS_ALLOW_ORIGIN` – optional; set to your web origin (e.g., `https://www.dregraham.com`).
4. **Secure the function**: attach it to an HTTPS endpoint (API Gateway HTTP API is a simple option). Protect the endpoint with an API key, IAM authorizer, or Cognito depending on your needs.
5. (Optional) **Add logging/monitoring** via CloudWatch log retention, X-Ray, or custom metrics.

## Request/Response Contract

- **POST body**
  ```json
  {
    "region": "us-east-2",            // optional – overrides DEFAULT_REGION
    "mode": "provision" | "destroy", // optional (defaults to provision)
    "requestId": "<uuid>",            // optional – supply to link destroy calls
    "stateKey": "multicloud-iac/aws/<uuid>.tfstate" // optional – backend key
  }
  ```
- **Response**: `202 Accepted` with `{ requestId, stateKey, mode, region }`.
- The handler sends `repository_dispatch` with:
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

## Security Notes

- Keep the GitHub token secret; prefer storing it in AWS Secrets Manager and referencing it from Lambda.
- Lock down the API Gateway endpoint (API keys, WAF, throttling) to prevent abuse.
- Consider adding request validation (e.g., allow-list origins, HMAC signatures) if exposing the endpoint publicly.

## Front-End Integration

The React page reads these environment variables:

- `REACT_APP_TERRAFORM_TRIGGER_URL` – HTTPS endpoint for this Lambda/API Gateway.
- `REACT_APP_TERRAFORM_TRIGGER_API_KEY` – optional header (`x-api-key`) if your gateway requires one.
- `REACT_APP_TERRAFORM_REGION` – overrides the default region included in dispatch payloads.

When a user clicks **Create Environment**, the page hits the trigger URL, receives a request ID, and displays it while the GitHub Actions workflow provisions and tears down the demo environment.
