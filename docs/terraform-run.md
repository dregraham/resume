# On-Demand Terraform Run Pipeline

This repository supports triggering real Terraform `apply` or `destroy` runs from the frontend through:

1. Frontend POST -> API Gateway -> Lambda (`backend/index.js`).
2. Lambda writes a `queued` run record to DynamoDB table `multicloud_iac_runs`.
3. Lambda dispatches a GitHub `repository_dispatch` event (`event_type: terraform_on_demand`).
4. GitHub Actions workflow `.github/workflows/terraform_on_demand.yml` picks it up and executes Terraform.
5. Workflow updates the DynamoDB item status + logs (`in_progress` -> `applied` / `destroyed` or `failed`).
6. Frontend polls the run and renders live status and captured logs.

## Required AWS Resources
- S3 backend bucket (defined in existing `backend.tf`).
- DynamoDB table for Terraform state locks: `terraform-state-locks`.
- DynamoDB run tracking table: `multicloud_iac_runs`.
- IAM principal used by GitHub Actions (`github-terraform-user`) with permissions defined in `terraform/iam_lambda_access.tf`:
  - The policy includes a statement with Sid `IAMForTerraform` that grants necessary permissions for:
    - S3 backend state management (bucket: `dre-multicloud-demo-site`)
    - DynamoDB state locking and run tracking (`terraform-state-locks`, `multicloud_iac_runs`)
    - IAM role management for Terraform-created roles (pattern: `terraform-*`)
    - Lambda function management for Terraform-created functions (pattern: `terraform-*`)
    - API Gateway resource management
    - DynamoDB table creation and management
  - See `terraform/iam_lambda_access.tf` for the complete IAM policy specification with explicit Resource ARNs

## Lambda Environment Variables
Set these on the dispatch Lambda:
- `API_KEY` (shared secret required by frontend as `REACT_APP_TERRAFORM_API_KEY`).
- `RUN_TABLE=multicloud_iac_runs`
- `GITHUB_OWNER=<repo owner>`
- `GITHUB_REPO=<repo name>`
- `GITHUB_WORKFLOW_TOKEN` (classic PAT or GitHub App token with `repo` + `workflow` scope to create repository_dispatch events).
- `AWS_REGION=us-east-2` (or your region).

## GitHub Repository Secrets
Add the following secrets for the workflow:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- (Optional) `AWS_SESSION_TOKEN` if using temporary creds.

## Status Values
- `queued`: Lambda persisted run; waiting for GitHub workflow start.
- `dispatch_failed`: GitHub dispatch call failed.
- `in_progress`: Workflow started; Terraform executing.
- `applied`: Successful apply.
- `destroyed`: Successful destroy.
- `failed`: Terraform command failed (plan/apply/destroy).

## Failure Modes & Diagnostics
- Stuck at `queued`: Most likely missing or invalid `GITHUB_WORKFLOW_TOKEN` or workflow file absent; Lambda now marks `dispatch_failed` when possible.
- Stuck at `in_progress`: Runner hung or AWS permissions denied; check Actions job logs.
- `failed`: Inspect captured logs in frontend (truncated to ~380KB).

## Local Manual Trigger (Debug)
You can send a repository_dispatch manually with `gh` CLI:
```bash
export RUN_ID=$(uuidgen)
gh api repos/<owner>/<repo>/dispatches -f event_type=terraform_on_demand -f client_payload='{ "runId": "'$RUN_ID'", "action": "apply", "clouds": ["aws"] }'
```
Then manually create DynamoDB item if bypassing Lambda:
```bash
aws dynamodb put-item --table-name multicloud_iac_runs --item '{"runId":{"S":"'$RUN_ID'"},"status":{"S":"queued"}}'
```

## Extending
- Multi-cloud: add conditional directories and select modules based on `clouds` payload; update workflow steps accordingly.
- Streaming logs: replace file aggregation with CloudWatch log subscription or S3 artifact pointer.
- Concurrency: add a run queue enforcement (e.g. check for existing `in_progress`).

## Security Notes
- Limit GitHub user/role permissions to only required AWS actions.
- Consider rotating `GITHUB_WORKFLOW_TOKEN` regularly.
- Narrow CORS allow-list in Lambda for production.

## Troubleshooting Checklist
1. Lambda returns 202 with runId? Yes -> proceed.
2. DynamoDB item becomes `in_progress` within ~30s? If not, check `dispatch_failed`.
3. GitHub Action logs show Terraform output? If not, inspect AWS credentials.
4. Final status updated (`applied`/`destroyed`)? If failed, consult logs.

## Cleanup
Frontend auto-trigger of destroy currently disabled/enabled? (See UI logic). Manual destroy run uses `action: destroy`.

---
Maintained by automation; adjust as pipeline evolves.
