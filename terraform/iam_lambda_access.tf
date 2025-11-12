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
          "lambda:ListFunctions"
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
      }
    ]
  })
}

