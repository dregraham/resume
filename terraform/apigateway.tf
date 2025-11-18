###############################################################################
# API Gateway Configuration with CORS Support
###############################################################################
locals {
  dispatch_api_id        = "1c5u47evyg"
  dispatch_execution_arn = "arn:aws:execute-api:us-east-2:895197120905:1c5u47evyg"
  base_invoke_url        = "https://1c5u47evyg.execute-api.us-east-2.amazonaws.com/prod"
  dispatch_options_route_id = "v9k66ev"   # Replace with your actual route ID
  dispatch_post_route_id    = "zht2bvl"   # Replace with your actual route ID
  dispatch_lambda_integration_id = "hqdgn90" # Replace with your actual integration ID
}

data "aws_apigatewayv2_api" "dispatch" {
  api_id = local.dispatch_api_id
}


# Reference existing route and integration IDs directly in locals or variables.
# You cannot use data sources for these, but you can use the IDs in other resources or outputs.

output "dispatch_api_url" {
  description = "Invoke URL for the Terraform dispatch API"
  value       = local.base_invoke_url
}

output "dispatch_options_route_id" {
  value = local.dispatch_options_route_id
}

output "dispatch_post_route_id" {
  value = local.dispatch_post_route_id
}

output "dispatch_lambda_integration_id" {
  value = local.dispatch_lambda_integration_id
}
