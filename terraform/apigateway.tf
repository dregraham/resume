###############################################################################
# API Gateway Configuration with CORS Support
###############################################################################
locals {
  dispatch_api_id        = "1c5u47evyg"
  dispatch_execution_arn = "arn:aws:execute-api:us-east-2:895197120905:1c5u47evyg"
  base_invoke_url        = "https://1c5u47evyg.execute-api.us-east-2.amazonaws.com/prod"
}

data "aws_apigatewayv2_api" "dispatch" {
  api_id = local.dispatch_api_id
}

# Reference existing routes and integration
data "aws_apigatewayv2_route" "dispatch_options" {
  api_id   = local.dispatch_api_id
  route_id = "v9k66ev"
}

data "aws_apigatewayv2_route" "dispatch_post" {
  api_id   = local.dispatch_api_id
  route_id = "zht2bvl"
}

data "aws_apigatewayv2_integration" "dispatch_lambda" {
  api_id        = local.dispatch_api_id
  integration_id = "hqdgn90"
}

output "dispatch_api_url" {
  description = "Invoke URL for the Terraform dispatch API"
  value       = "https://1c5u47evyg.execute-api.us-east-2.amazonaws.com/prod/terraform"
}
