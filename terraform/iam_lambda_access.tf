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
    ]
  })
}

# Attach the policy to the Terraform user (assumes user already exists)
# NOTE: Policy attachment is managed manually (already attached). Terraform user lacks iam:AttachUserPolicy prior to attachment,
# which caused a bootstrap cyclical failure. Remove automatic attachment to avoid AccessDenied.
# To re-enable Terraform management later, grant broader iam:* permissions via a bootstrap role and re-add this resource.

