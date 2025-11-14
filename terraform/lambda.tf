locals {
  dispatch_lambda_source_dir = abspath("${path.module}/../aws/terraform-dispatch-lambda")
}

data "archive_file" "dispatch" {
  type        = "zip"
  source_dir  = local.dispatch_lambda_source_dir
  output_path = "${path.module}/lambda_dispatch.zip"
}

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_role" "terraform_execution_role" {
  name = "TerraformExecutionRole"
}

data "aws_lambda_function" "dispatch" {
  function_name = "terraform-dispatch-lambda"
}

data "aws_iam_policy" "lambda_access" {
  name        = "TerraformLambdaAccess"
}
