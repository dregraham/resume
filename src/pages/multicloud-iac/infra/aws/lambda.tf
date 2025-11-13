data "aws_iam_role" "lambda_exec" {
  name = "terraform-dispatch-lambda-exec"
}

data "aws_lambda_function" "dispatch" {
  function_name = "terraform-dispatch-lambda"
}
