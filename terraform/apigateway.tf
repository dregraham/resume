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

data "aws_apigatewayv2_api" "dispatch" {
  api_id = local.dispatch_api_id
}

output "dispatch_api_url" {
  description = "Invoke URL for the Terraform dispatch API"
  value       = "https://1c5u47evyg.execute-api.us-east-2.amazonaws.com/prod/terraform"
}
