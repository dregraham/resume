resource "aws_iam_policy" "lambda_access" {
  name        = "TerraformLambdaAccess"
  description = "Allow Terraform user to read and invoke terraform-dispatch-lambda"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "lambda:GetFunction",
          "lambda:ListVersionsByFunction",
          "lambda:GetFunctionConfiguration",
          "lambda:InvokeFunction",
          "lambda:ListFunctions",
          "lambda:GetFunctionConcurrency"
        ]
        Resource = "arn:aws:lambda:us-east-2:895197120905:function:terraform-dispatch-lambda"
      },
      {
        Effect = "Allow"
        Action = [
          "logs:DescribeLogStreams",
          "logs:GetLogEvents"
        ]
        Resource = "arn:aws:logs:us-east-2:895197120905:log-group:/aws/lambda/terraform-dispatch-lambda:*"
      },
      # Added permissions for API Gateway stage access logging / delivery setup
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams",
          "logs:CreateLogDelivery",
          "logs:GetLogDelivery",
          "logs:UpdateLogDelivery",
          "logs:DeleteLogDelivery",
          "logs:ListLogDeliveries"
        ]
        Resource = "*"
      },
      # Allow API Gateway to manage stage & read API details if needed for future expansion
      {
        Effect = "Allow"
        Action = [
          "apigateway:GET",
          "apigateway:PATCH",
          "apigateway:POST",
          "apigateway:DELETE",
          "iam:AttachUserPolicy",
          "iam:GetUser"
        ]
        Resource = "*"
      },
      # Terraform-specific permissions for GitHub Actions workflow
      {
        Sid    = "IAMForTerraform"
        Effect = "Allow"
        Action = [
          # S3 permissions for Terraform backend state storage
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket",
          "s3:GetBucketVersioning",
          # DynamoDB permissions for state locking and run tracking
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem",
          "dynamodb:DescribeTable",
          "dynamodb:UpdateItem",
          # IAM permissions for role management
          "iam:PassRole",
          "iam:GetRole",
          "iam:CreateRole",
          "iam:DeleteRole",
          "iam:AttachRolePolicy",
          "iam:DetachRolePolicy",
          "iam:PutRolePolicy",
          "iam:DeleteRolePolicy",
          "iam:GetRolePolicy",
          "iam:ListAttachedRolePolicies",
          "iam:ListRolePolicies",
          "iam:TagRole",
          "iam:UntagRole",
          # Lambda permissions for Terraform resource management
          "lambda:CreateFunction",
          "lambda:DeleteFunction",
          "lambda:UpdateFunctionCode",
          "lambda:UpdateFunctionConfiguration",
          "lambda:PublishVersion",
          "lambda:AddPermission",
          "lambda:RemovePermission",
          "lambda:GetPolicy",
          "lambda:TagResource",
          "lambda:UntagResource",
          # API Gateway permissions for Terraform resource management
          "apigateway:CreateApi",
          "apigateway:DeleteApi",
          "apigateway:UpdateApi",
          "apigateway:TagResource",
          "apigateway:UntagResource",
          "apigateway:CreateIntegration",
          "apigateway:DeleteIntegration",
          "apigateway:UpdateIntegration",
          "apigateway:CreateRoute",
          "apigateway:DeleteRoute",
          "apigateway:UpdateRoute",
          "apigateway:CreateStage",
          "apigateway:DeleteStage",
          "apigateway:UpdateStage",
          # DynamoDB table management permissions
          "dynamodb:CreateTable",
          "dynamodb:DeleteTable",
          "dynamodb:UpdateTable",
          "dynamodb:TagResource",
          "dynamodb:UntagResource",
          "dynamodb:ListTables"
        ]
        Resource = [
          # S3 backend bucket and objects
          "arn:aws:s3:::dre-multicloud-demo-site",
          "arn:aws:s3:::dre-multicloud-demo-site/*",
          # DynamoDB state lock table
          "arn:aws:dynamodb:us-east-2:895197120905:table/terraform-state-locks",
          # DynamoDB run tracking table
          "arn:aws:dynamodb:us-east-2:895197120905:table/multicloud_iac_runs",
          # IAM roles created/managed by Terraform
          "arn:aws:iam::895197120905:role/terraform-*",
          # Lambda functions created/managed by Terraform
          "arn:aws:lambda:us-east-2:895197120905:function:terraform-*",
          # API Gateway resources
          "arn:aws:apigateway:us-east-2::/apis/*",
          "arn:aws:apigateway:us-east-2::/apis/*/integrations/*",
          "arn:aws:apigateway:us-east-2::/apis/*/routes/*",
          "arn:aws:apigateway:us-east-2::/apis/*/stages/*"
        ]
      }
    ]
  })
}

# Attach the policy to the Terraform user (assumes user already exists)
# NOTE: Policy attachment is managed manually (already attached). Terraform user lacks iam:AttachUserPolicy prior to attachment,
# which caused a bootstrap cyclical failure. Remove automatic attachment to avoid AccessDenied.
# To re-enable Terraform management later, grant broader iam:* permissions via a bootstrap role and re-add this resource.

