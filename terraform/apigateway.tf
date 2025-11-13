###############################################################################
# API Gateway (create new OR reuse existing via var.existing_api_id)
###############################################################################

data "aws_apigatewayv2_api" "existing" {
  count  = var.existing_api_id != "" ? 1 : 0
  api_id = var.existing_api_id
}

resource "aws_apigatewayv2_api" "dispatch" {
  count         = var.existing_api_id == "" ? 1 : 0
  name          = "terraform-dispatch-http"
  protocol_type = "HTTP"

  cors_configuration {
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["Content-Type", "x-api-key"]
    allow_origins = [var.cors_allow_origin]
  }
}

###############################################################################
# Locals unify IDs / invoke URL regardless of path taken
###############################################################################
locals {
  # Use try() to avoid invalid index errors when count = 0 on optional resources
  dispatch_api_id        = var.existing_api_id != "" ? var.existing_api_id : try(aws_apigatewayv2_api.dispatch[0].id, "")
  dispatch_execution_arn = var.existing_api_id != "" ? try(data.aws_apigatewayv2_api.existing[0].execution_arn, "") : try(aws_apigatewayv2_api.dispatch[0].execution_arn, "")
  # For existing API assume stage "prod" already present; we do not manage it if existing_api_id supplied
  base_invoke_url        = var.existing_api_id != "" ? "${try(data.aws_apigatewayv2_api.existing[0].api_endpoint, "")}/prod" : try(aws_apigatewayv2_stage.dispatch[0].invoke_url, "")
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
# Stage only if we create the API
###############################################################################
resource "aws_apigatewayv2_stage" "dispatch" {
  count       = var.existing_api_id == "" ? 1 : 0
  api_id      = aws_apigatewayv2_api.dispatch[0].id
  name        = "prod"
  auto_deploy = true
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
  value       = "${local.base_invoke_url}/terraform"
}
