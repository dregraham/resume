data "aws_apigatewayv2_api" "dispatch" {
  name = "terraform-dispatch-http"
}

data "aws_apigatewayv2_stage" "dispatch" {
  api_id     = data.aws_apigatewayv2_api.dispatch.id
  stage_name = "prod"
}

output "dispatch_api_url" {
  description = "Invoke URL for the Terraform dispatch API"
  value       = "${data.aws_apigatewayv2_stage.dispatch.invoke_url}/terraform"
}
