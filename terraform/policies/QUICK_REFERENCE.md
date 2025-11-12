# Quick Reference: Policy Changes

## Before vs After Comparison

### Statement 2 (VisualEditor2) - EC2 Subnet Operations
```diff
  {
      "Sid": "VisualEditor2",
      "Effect": "Allow",
      "Action": [
          "ec2:DeleteSubnet",
          "ec2:CreateSubnet",
-         "ec2:ModifySubnetAttribute"
+         "ec2:ModifySubnetAttribute",
+         "ec2:DescribeSubnets"
      ],
-     "Resource": "arn:aws:apigateway:us-east-2::/apis*"
+     "Resource": "*"
  }
```
**Fix**: Changed from API Gateway ARN to wildcard (required for EC2 operations)

### Statement 3 (VisualEditor3) - IAM Instance Profiles
```diff
  {
      "Sid": "VisualEditor3",
      "Effect": "Allow",
      "Action": [
          "iam:GetInstanceProfile",
-         "iam:AddRoleToInstanceProfile"
+         "iam:AddRoleToInstanceProfile",
+         "iam:CreateInstanceProfile",
+         "iam:DeleteInstanceProfile",
+         "iam:ListInstanceProfilesForRole",
+         "iam:RemoveRoleFromInstanceProfile"
      ],
-     "Resource": "arn:aws:apigateway:us-east-2::/apis*"
+     "Resource": "*"
  }
```
**Fix**: Changed from API Gateway ARN to wildcard + added missing instance profile actions

### New Statement 7 - Terraform State Backend
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
**Addition**: Essential for Terraform S3 backend state storage

### New Statement 8 - Terraform State Locking
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
**Addition**: Essential for Terraform state locking (prevents concurrent modifications)

## Permission Additions by Service

### Lambda (+8 actions)
- `lambda:RemovePermission`
- `lambda:PublishVersion`
- `lambda:CreateAlias`, `lambda:DeleteAlias`, `lambda:UpdateAlias`, `lambda:GetAlias`
- `lambda:GetPolicy`
- `lambda:ListFunctions`, `lambda:ListVersionsByFunction`, etc.

### DynamoDB (+6 actions)
- `dynamodb:Query`
- `dynamodb:DescribeTimeToLive`, `dynamodb:UpdateTimeToLive`
- `dynamodb:TagResource`, `dynamodb:UntagResource`, `dynamodb:ListTagsOfResource`
- `dynamodb:DescribeLimits`

### S3 (+7 actions)
- `s3:PutObjectTagging`, `s3:DeleteObjectTagging`
- `s3:AbortMultipartUpload`, `s3:ListBucketMultipartUploads`
- `s3:GetBucketVersioning`, `s3:PutBucketVersioning`
- `s3:GetBucketEncryption`, `s3:PutBucketEncryption`

### IAM (+11 actions)
- `iam:CreatePolicy`, `iam:DeletePolicy`
- `iam:GetPolicy`, `iam:GetPolicyVersion`, `iam:ListPolicyVersions`
- `iam:CreatePolicyVersion`, `iam:DeletePolicyVersion`
- `iam:TagRole`, `iam:UntagRole`, `iam:TagPolicy`, `iam:UntagPolicy`
- `iam:TagInstanceProfile`, `iam:UntagInstanceProfile`

### CloudWatch Logs (+11 actions)
- `logs:DescribeLogGroups`, `logs:DescribeLogStreams`
- `logs:GetLogEvents`
- `logs:DeleteLogGroup`, `logs:DeleteLogStream`
- `logs:PutRetentionPolicy`, `logs:DeleteRetentionPolicy`
- `logs:TagLogGroup`, `logs:UntagLogGroup`
- `logs:CreateLogDelivery`, `logs:GetLogDelivery`, `logs:UpdateLogDelivery`
- `logs:DeleteLogDelivery`, `logs:ListLogDeliveries`

### API Gateway
- Added support for REST APIs: `arn:aws:apigateway:us-east-2::/restapis*`

## Total Changes Summary

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Statements | 6 | 8 | +2 |
| Unique Actions | ~106 | 149 | +43 |
| Critical Bugs | 2 | 0 | Fixed |
| Resource Types Covered | 6 | 8 | +2 |

## How to Apply This Policy

1. **Save the policy file locally** (already in repo at `terraform/policies/github-terraform-runner-policy.json`)

2. **Create or update IAM policy in AWS:**
   ```bash
   # For new policy
   aws iam create-policy \
     --policy-name GitHubTerraformRunnerPolicy \
     --policy-document file://terraform/policies/github-terraform-runner-policy.json

   # For existing policy (creates new version)
   aws iam create-policy-version \
     --policy-arn arn:aws:iam::895197120905:policy/GitHubTerraformRunnerPolicy \
     --policy-document file://terraform/policies/github-terraform-runner-policy.json \
     --set-as-default
   ```

3. **Attach to IAM principal:**
   ```bash
   # For IAM User
   aws iam attach-user-policy \
     --user-name github-terraform-user \
     --policy-arn arn:aws:iam::895197120905:policy/GitHubTerraformRunnerPolicy

   # For IAM Role
   aws iam attach-role-policy \
     --role-name github-terraform-runner-role \
     --policy-arn arn:aws:iam::895197120905:policy/GitHubTerraformRunnerPolicy
   ```

## Testing Checklist

After applying the updated policy:

- [ ] Run `terraform init` - validates S3 backend access
- [ ] Run `terraform plan` - validates read permissions
- [ ] Run `terraform apply` - validates create/update permissions
- [ ] Verify DynamoDB state locking (check for lock table entries during apply)
- [ ] Run `terraform destroy` - validates delete permissions
- [ ] Check CloudTrail for any AccessDenied errors

## See Also

- **Full Documentation**: `terraform/policies/README.md`
- **Detailed Changes**: `terraform/policies/CHANGES.md`
- **Policy File**: `terraform/policies/github-terraform-runner-policy.json`
