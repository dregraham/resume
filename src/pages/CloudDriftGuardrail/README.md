# Cloud Drift Guardrail

Automated EC2 drift detection and cost control for AWS. Instantly stops non-production instances and enforces run windows to prevent cloud cost overruns.

## Table of Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [Features](#features)
- [Getting Started](#getting-started)
- [CI/CD Pipeline](#cicd-pipeline)
- [Docker Usage](#docker-usage)
- [Customization](#customization)
- [License](#license)

---

## Overview

Cloud Drift Guardrail is a serverless automation tool that scans your AWS account for EC2 instances missing a specific tag (e.g., `prod`) and automatically stops them. This helps prevent unnecessary cloud spend and keeps your environment clean.

---

## How It Works

1. **EC2 Instance Scan**  
   Scans all running EC2 instances in your AWS account on a schedule or via Lambda trigger.

2. **Tag Validation**  
   Checks each instance for the presence of a `prod` tag. Instances without this tag are flagged as non-production.  
   _This tag can be customized to fit whatever resource you want to control drift on._

3. **Automated Stop Action**  
   Automatically stops EC2 instances that are missing the `prod` tag, preventing unnecessary costs from idle or forgotten resources.

4. **Cost Control & Reporting**  
   Sends notifications or logs actions taken, providing visibility and auditability for cloud hygiene and cost control.

---

## Features

- Automated EC2 drift detection
- Customizable tag for production resources
- Scheduled or on-demand execution (via Lambda)
- Cost control and reporting via EventBridge or CloudWatch
- Easy integration with CI/CD and Docker

---

## Getting Started

### Prerequisites

- AWS account with appropriate IAM permissions
- [Terraform](https://www.terraform.io/) (for infrastructure as code)
- [Docker](https://www.docker.com/) (optional, for local runs)

### Clone the Repository

```sh
git clone https://gitlab.com/dregraham-group/cloud-drift-guardrail.git
cd cloud-drift-guardrail
```

### Configure AWS Credentials

Set your AWS credentials as environment variables:

```sh
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_REGION=us-east-1
```

---

## CI/CD Pipeline

Example `.gitlab-ci.yml` for Terraform automation:

```yaml
stages:
  - validate
  - plan
  - apply

variables:
  TF_WORKING_DIR: "./terraform"

validate:
  stage: validate
  image: hashicorp/terraform:1.9
  script:
    - terraform -chdir=$TF_WORKING_DIR init
    - terraform -chdir=$TF_WORKING_DIR validate

plan:
  stage: plan
  image: hashicorp/terraform:1.9
  script:
    - terraform -chdir=$TF_WORKING_DIR plan
  artifacts:
    paths:
      - "$TF_WORKING_DIR/plan.out"

apply:
  stage: apply
  when: manual
  image: hashicorp/terraform:1.9
  script:
    - terraform -chdir=$TF_WORKING_DIR apply -auto-approve

deploy-infra:
  stage: apply
  image: hashicorp/terraform:1.9
  when: manual
  script:
    - aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
    - aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
    - aws configure set region $AWS_REGION
    - terraform -chdir=$TF_WORKING_DIR init
    - terraform -chdir=$TF_WORKING_DIR apply -auto-approve
```

---

## Docker Usage

Run the tool in a containerized environment:

```sh
docker run -e AWS_ACCESS_KEY_ID=your_key -e AWS_SECRET_ACCESS_KEY=your_secret -e AWS_REGION=us-east-1 \
  -v $(pwd)/terraform:/workspace/terraform \
  hashicorp/terraform:1.9 plan -chdir=/workspace/terraform
```

---

## Customization

- **Tag Name:**  
  Change the tag key from `prod` to any value you want to control drift on.  
  Update the Lambda or script logic as needed.

- **Notification Method:**  
  Integrate with EventBridge, CloudWatch, or your preferred notification system.

---

## License

This project is licensed under the MIT License.

---
