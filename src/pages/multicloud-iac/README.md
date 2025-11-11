
# 🌩️ Multi-Cloud Infrastructure-as-Code Automation

The **Multi-Cloud IaC Automation Project** demonstrates how **Terraform** and **GitHub Actions** can provision, monitor, and destroy temporary cloud environments across **AWS** and **Azure** while following modern DevOps security practices.

It mirrors how enterprise delivery pipelines stand up reproducible cloud environments, export metadata to observability stores, and automatically tear them down to control cost exposure.

## 🔄 On-Demand Demo Flow

1. A user clicks **Create Environment** on the React page.
2. The page calls a secured HTTPS endpoint (`REACT_APP_TERRAFORM_TRIGGER_URL`).
3. That endpoint runs the Lambda in `aws/terraform-dispatch-lambda/index.js`, which emits a `repository_dispatch` event to GitHub with a unique request ID and backend state key.
4. `.github/workflows/terraform-aws-on-demand.yml` responds, executes `terraform apply` against `infra/aws`, waits ≈120 seconds, and then executes `terraform destroy` using remote S3 state and DynamoDB locking.
5. The UI streams console-style feedback, surfaces the request ID, and polls the latest `env/latest.json` metadata from S3 while the environment lives.
6. When the countdown expires—or the user presses **Destroy Environment**—the UI dispatches a `mode: destroy` request with the same request/state key for an early teardown.

## 🧠 Features

- 🧩 **Terraform-Driven Infrastructure** — declarative IaC for AWS & Azure resources.
- 🔁 **CI/CD Automation** — GitHub Actions workflows validate, plan, apply, and destroy Terraform changes automatically.
- 🔐 **Secure Secrets Management** — GitHub Secrets store IAM & Azure credentials with least-privilege access.
- ☁️ **Cross-Cloud Logging** — metadata exported to AWS S3 (`dre-multicloud-demo-site`) and Azure Blob (`dremulticlouddemosite`).
- ⏳ **Ephemeral Environments** — short-lived demo stacks auto-destroy after two minutes.

## 🔧 Required Configuration

- Repository secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `TF_STATE_BUCKET`, `TF_LOCK_TABLE`.
- GitHub environment `aws-terraform` to gate manual `apply`/`destroy` runs in `.github/workflows/terraform-aws-deploy.yml`.
- AWS Lambda/API Gateway hosting `aws/terraform-dispatch-lambda/index.js` with environment variables `GITHUB_WORKFLOW_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, `DEFAULT_REGION`, and optional `CORS_ALLOW_ORIGIN`.
- React build-time environment variables: `REACT_APP_TERRAFORM_TRIGGER_URL`, optional `REACT_APP_TERRAFORM_TRIGGER_API_KEY`, and `REACT_APP_TERRAFORM_REGION`.