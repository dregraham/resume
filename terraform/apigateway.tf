###############################################################################
# API Gateway (existing via var.existing_api_id)
###############################################################################

###############################################################################
# Locals for shared API Gateway
###############################################################################
locals {
  dispatch_api_id        = "1c5u47evyg"
  dispatch_execution_arn = "arn:aws:execute-api:us-east-2:895197120905:1c5u47evyg"
  base_invoke_url        = "https://1c5u47evyg.execute-api.us-east-2.amazonaws.com/prod"
}

###############################################################################
# Integration & route (will create if not present; import first if they exist)
###############################################################################
resource "aws_apigatewayv2_integration" "dispatch" {
  api_id                 = local.dispatch_api_id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.dispatch.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "dispatch_post" {
  api_id    = local.dispatch_api_id
  route_key = "POST /terraform"
  target    = "integrations/${aws_apigatewayv2_integration.dispatch.id}"
}

###############################################################################
# Lambda permission (always ensure invocation allowed)
###############################################################################
resource "aws_lambda_permission" "dispatch_invoke" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.dispatch.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${local.dispatch_execution_arn}/*/*"
}

output "dispatch_api_url" {
  description = "Invoke URL for the Terraform dispatch API"
  value       = "https://1c5u47evyg.execute-api.us-east-2.amazonaws.com/prod/terraform"
}
