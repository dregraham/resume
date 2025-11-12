# IAM Policies for Terraform Operations

This directory contains IAM policy documents for AWS principals used by GitHub Actions to execute Terraform operations.

## github-terraform-runner-policy.json

This policy grants comprehensive permissions required for Terraform to manage infrastructure in this repository.

### Purpose
- Attached to the `github-terraform-user` IAM user (or role) used by GitHub Actions workflows
- Allows Terraform to create, update, and destroy AWS resources
- Includes permissions for Terraform state management (S3 backend and DynamoDB locking)

### Key Permission Categories

1. **Lambda Functions**
   - Full lifecycle management (create, update, delete, invoke)
   - Function configuration and versioning
   - Permission management

2. **DynamoDB Tables**
   - Table operations (create, delete, describe)
   - Item operations (get, put, delete, update, scan, query)
   - Tags and Time-to-Live settings
   - Includes tables: `environment_lifecycle`, `multicloud_iac_runs`, `terraform-state-locks`

3. **S3 Buckets**
   - Bucket operations (create, delete, list, configure)
   - Object operations (get, put, delete)
   - Versioning and encryption configuration
   - Includes: `dre-multicloud-demo-site` and Terraform state buckets

4. **API Gateway**
   - Full API management (GET, POST, PUT, PATCH, DELETE)
   - Supports both HTTP APIs and REST APIs

5. **EC2 Resources**
   - VPC, subnet, security group management
   - Instance operations
   - Key pair management
   - Network routing and internet gateway operations

6. **IAM**
   - Role and policy management
   - Instance profile operations
   - Policy attachment/detachment
   - PassRole for service-to-service permissions

7. **CloudWatch Logs**
   - Log group and stream management
   - Log event operations
   - Log delivery configuration
   - Retention policies

8. **Terraform State Management**
   - S3 backend access for state files
   - DynamoDB locking for concurrent operation prevention

### Resource Scope
- **Region**: Primarily `us-east-2` (some permissions are global with `*`)
- **Account ID**: `895197120905`
- **Specific Resources**: See policy document for detailed ARN patterns

### Key Fixes from Original Policy

1. **Fixed Resource ARNs**: 
   - VisualEditor2 (EC2 subnet operations) now correctly uses `Resource: "*"` instead of API Gateway ARN
   - VisualEditor3 (IAM instance profiles) now correctly uses `Resource: "*"` instead of API Gateway ARN

2. **Added Missing Permissions**:
   - Lambda: `RemovePermission`, `PublishVersion`, `CreateAlias`, `DeleteAlias`, `UpdateAlias`, `GetAlias`, `GetPolicy`
   - DynamoDB: `Query`, `DescribeTimeToLive`, `UpdateTimeToLive`, tagging operations, `DescribeLimits`
   - S3: Additional bucket operations for encryption, versioning, multipart uploads
   - IAM: `CreatePolicy`, `DeletePolicy`, `GetPolicy`, `GetPolicyVersion`, `ListPolicyVersions`, `CreatePolicyVersion`, `DeletePolicyVersion`, tagging operations
   - CloudWatch Logs: Extended log management, delivery operations, retention policies
   - API Gateway: Added `restapis` ARN pattern for REST APIs
   - Added dedicated Terraform state backend and locking permissions

3. **Enhanced State Management**:
   - New statement for S3 state backend access
   - New statement for DynamoDB state locking
   - Support for common Terraform state bucket naming patterns

### How to Apply

**Using AWS CLI:**
```bash
# Create a new policy
aws iam create-policy \
  --policy-name GitHubTerraformRunnerPolicy \
  --policy-document file://github-terraform-runner-policy.json

# Or update an existing policy (create a new version)
aws iam create-policy-version \
  --policy-arn arn:aws:iam::895197120905:policy/GitHubTerraformRunnerPolicy \
  --policy-document file://github-terraform-runner-policy.json \
  --set-as-default
```

**Attach to IAM User:**
```bash
aws iam attach-user-policy \
  --user-name github-terraform-user \
  --policy-arn arn:aws:iam::895197120905:policy/GitHubTerraformRunnerPolicy
```

**Attach to IAM Role:**
```bash
aws iam attach-role-policy \
  --role-name github-terraform-runner-role \
  --policy-arn arn:aws:iam::895197120905:policy/GitHubTerraformRunnerPolicy
```

### Security Considerations

1. **Least Privilege**: While comprehensive, consider restricting permissions further if certain operations are not needed
2. **Resource Restrictions**: Where possible, permissions are scoped to specific resource ARNs
3. **Wildcards**: Some permissions use `Resource: "*"` where AWS services require it (e.g., EC2 describe operations)
4. **Review Regularly**: Audit this policy periodically to ensure it matches actual Terraform requirements
5. **Separate Environments**: Consider different policies for dev/staging/prod environments

### Troubleshooting

If Terraform operations fail with permission errors:

1. Check CloudTrail for the exact denied action
2. Verify the resource ARN matches patterns in this policy
3. Ensure the policy is attached to the correct IAM principal
4. Check for service control policies (SCPs) that may override this policy

### Related Files

- `/terraform/iam_lambda_access.tf` - Terraform-managed policy for Lambda dispatch access
- `/docs/terraform-run.md` - Documentation for on-demand Terraform runs
- `/.github/workflows/terraform_on_demand.yml` - GitHub Actions workflow using these permissions
