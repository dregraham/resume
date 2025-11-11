resource "aws_apigatewayv2_api" "dispatch" {
  name          = "terraform-dispatch-http"
  protocol_type = "HTTP"

  cors_configuration {
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["Content-Type", "x-api-key"]
    allow_origins = [var.cors_allow_origin]
  }
}

resource "aws_apigatewayv2_integration" "dispatch" {
  api_id                 = aws_apigatewayv2_api.dispatch.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.dispatch.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "dispatch_post" {
  api_id    = aws_apigatewayv2_api.dispatch.id
  route_key = "POST /terraform"
  target    = "integrations/${aws_apigatewayv2_integration.dispatch.id}"
}

resource "aws_apigatewayv2_route" "dispatch_options" {
  api_id    = aws_apigatewayv2_api.dispatch.id
  route_key = "OPTIONS /terraform"
  target    = "integrations/${aws_apigatewayv2_integration.dispatch.id}"
}

resource "aws_apigatewayv2_stage" "dispatch" {
  api_id      = aws_apigatewayv2_api.dispatch.id
  name        = "prod"
  auto_deploy = true
}

resource "aws_lambda_permission" "dispatch_invoke" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.dispatch.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.dispatch.execution_arn}/*/*"
}

output "dispatch_api_url" {
  description = "Invoke URL for the Terraform dispatch API"
  value       = "${aws_apigatewayv2_stage.dispatch.invoke_url}/terraform"
}
