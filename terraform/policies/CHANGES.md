# IAM Policy Update Summary

## Overview
Updated the GitHub Terraform runner IAM policy to ensure all necessary Terraform permissions are allowed.

## Key Changes

### 1. Fixed Resource ARN Mismatches
**Problem**: Statements 2 and 3 had incorrect resource ARNs (API Gateway ARNs for EC2 and IAM actions)

- **VisualEditor2** (EC2 subnet operations):
  - **Before**: `"Resource": "arn:aws:apigateway:us-east-2::/apis*"`
  - **After**: `"Resource": "*"`
  - **Reason**: EC2 subnet operations require wildcard resources

- **VisualEditor3** (IAM instance profiles):
  - **Before**: `"Resource": "arn:aws:apigateway:us-east-2::/apis*"`
  - **After**: `"Resource": "*"`
  - **Reason**: IAM instance profile operations require wildcard resources

### 2. Added Missing Lambda Permissions
Added to VisualEditor0:
- `lambda:RemovePermission` - Remove resource-based policy statements
- `lambda:PublishVersion` - Publish Lambda versions
- `lambda:CreateAlias`, `lambda:DeleteAlias`, `lambda:UpdateAlias`, `lambda:GetAlias` - Alias management
- `lambda:GetPolicy` - Read resource-based policies
- `lambda:ListFunctions`, `lambda:ListVersionsByFunction`, `lambda:GetFunctionConfiguration`, `lambda:GetFunctionConcurrency` - List and describe operations

### 3. Enhanced DynamoDB Permissions
Added to VisualEditor0:
- `dynamodb:Query` - Query table items
- `dynamodb:DescribeTimeToLive`, `dynamodb:UpdateTimeToLive` - TTL management
- `dynamodb:TagResource`, `dynamodb:UntagResource`, `dynamodb:ListTagsOfResource` - Tag management

Added to VisualEditor5:
- `dynamodb:DescribeLimits` - Account-level limits

Added resources to VisualEditor0:
- `arn:aws:dynamodb:us-east-2:895197120905:table/multicloud_iac_runs`
- `arn:aws:dynamodb:us-east-2:895197120905:table/terraform-state-locks`

### 4. Expanded S3 Permissions
Added to VisualEditor0:
- `s3:PutObjectTagging`, `s3:DeleteObjectTagging` - Object tagging
- `s3:AbortMultipartUpload`, `s3:ListBucketMultipartUploads` - Multipart upload management
- `s3:GetBucketVersioning`, `s3:PutBucketVersioning` - Versioning configuration
- `s3:GetBucketEncryption`, `s3:PutBucketEncryption` - Encryption configuration

### 5. Extended IAM Permissions
Added to VisualEditor4:
- `iam:CreatePolicy`, `iam:DeletePolicy` - Policy lifecycle
- `iam:GetPolicy`, `iam:GetPolicyVersion`, `iam:ListPolicyVersions` - Policy inspection
- `iam:CreatePolicyVersion`, `iam:DeletePolicyVersion` - Policy versioning
- `iam:TagRole`, `iam:UntagRole` - Role tagging
- `iam:TagPolicy`, `iam:UntagPolicy` - Policy tagging
- `iam:TagInstanceProfile`, `iam:UntagInstanceProfile` - Instance profile tagging

### 6. Enhanced CloudWatch Logs Permissions
Added to VisualEditor4:
- `logs:DescribeLogGroups`, `logs:DescribeLogStreams` - Log inspection
- `logs:GetLogEvents` - Read log events
- `logs:DeleteLogGroup`, `logs:DeleteLogStream` - Log cleanup
- `logs:PutRetentionPolicy`, `logs:DeleteRetentionPolicy` - Retention management
- `logs:TagLogGroup`, `logs:UntagLogGroup` - Log group tagging
- `logs:CreateLogDelivery`, `logs:GetLogDelivery`, `logs:UpdateLogDelivery`, `logs:DeleteLogDelivery`, `logs:ListLogDeliveries` - Log delivery configuration

### 7. Added API Gateway REST API Support
Added to VisualEditor0 and VisualEditor1:
- `arn:aws:apigateway:us-east-2::/restapis*` - Support for REST APIs in addition to HTTP APIs

### 8. NEW: Terraform State Backend Permissions
Added new statement "TerraformStateBackend":
```json
{
    "Sid": "TerraformStateBackend",
    "Effect": "Allow",
    "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:GetBucketVersioning",
        "s3:GetBucketLocation"
    ],
    "Resource": [
        "arn:aws:s3:::terraform-state-*",
        "arn:aws:s3:::terraform-state-*/*",
        "arn:aws:s3:::*-terraform-state",
        "arn:aws:s3:::*-terraform-state/*"
    ]
}
```
**Reason**: Terraform requires S3 backend access to store state files

### 9. NEW: Terraform State Locking Permissions
Added new statement "TerraformStateLocking":
```json
{
    "Sid": "TerraformStateLocking",
    "Effect": "Allow",
    "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:DescribeTable",
        "dynamodb:CreateTable",
        "dynamodb:DeleteTable"
    ],
    "Resource": [
        "arn:aws:dynamodb:*:*:table/terraform-state-locks",
        "arn:aws:dynamodb:*:*:table/*-terraform-state-lock"
    ]
}
```
**Reason**: Terraform uses DynamoDB for state locking to prevent concurrent modifications

## Permission Coverage

The updated policy now covers all standard Terraform operations:

✅ **Resource Creation**: Create Lambda functions, DynamoDB tables, S3 buckets, API Gateways, EC2 resources, IAM roles/policies
✅ **Resource Updates**: Modify configurations, update function code, change table settings
✅ **Resource Deletion**: Clean up all managed resources
✅ **State Management**: S3 backend read/write, DynamoDB state locking
✅ **Tagging**: Apply and manage tags on all resource types
✅ **Describe/List**: Query resource states and configurations
✅ **IAM**: Manage roles, policies, and instance profiles for service permissions
✅ **Logging**: Configure and manage CloudWatch Logs for observability

## Files Created

1. `/terraform/policies/github-terraform-runner-policy.json` - The complete IAM policy
2. `/terraform/policies/README.md` - Comprehensive documentation and usage instructions
3. `/terraform/policies/CHANGES.md` - This file, documenting all changes

## How to Apply

See `/terraform/policies/README.md` for detailed instructions on applying this policy to your IAM user or role.

## Testing Recommendations

After applying this policy:

1. Run `terraform plan` to verify read permissions
2. Run `terraform apply` on a test resource to verify write permissions
3. Run `terraform destroy` to verify delete permissions
4. Check Terraform state operations (S3 read/write, DynamoDB locking)
5. Monitor CloudTrail for any remaining permission denials

## Security Notes

- All permissions are scoped to specific resources where possible
- Some permissions require `Resource: "*"` due to AWS service requirements
- Consider implementing AWS Organizations SCPs for additional guardrails
- Review and adjust permissions based on your specific Terraform configurations
