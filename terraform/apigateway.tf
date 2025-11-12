resource "aws_apigatewayv2_api" "terraform_api" {
  name          = "TerraformDispatcherAPI"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                 = aws_apigatewayv2_api.terraform_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = data.aws_lambda_function.dispatcher.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "terraform_route" {
  api_id    = aws_apigatewayv2_api.terraform_api.id
  route_key = "ANY /terraform"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.terraform_api.id
  name        = "prod"
  auto_deploy = true
}

output "terraform_endpoint" {
  value = "${aws_apigatewayv2_api.terraform_api.api_endpoint}/prod/terraform"
}
