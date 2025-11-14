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

resource "aws_lambda_function" "dispatch" {
  function_name    = "terraform-dispatch-lambda"
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  role             = data.aws_iam_role.terraform_execution_role.arn
  filename         = data.archive_file.dispatch.output_path
  source_code_hash = data.archive_file.dispatch.output_base64sha256

  environment {
    variables = {
      GITHUB_WORKFLOW_TOKEN = var.github_token
      GITHUB_OWNER          = var.github_owner
      GITHUB_REPO           = var.github_repo
      DEFAULT_REGION        = var.default_region
      CORS_ALLOW_ORIGIN     = var.cors_allow_origin
    }
  }
}

data "aws_iam_role" "lambda_exec" {
  name = "terraform-dispatch-lambda-exec"
}

data "aws_lambda_function" "dispatch" {
  function_name = "terraform-dispatch-lambda"
}
