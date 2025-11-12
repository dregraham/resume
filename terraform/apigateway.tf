resource "aws_apigatewayv2_api" "terraform_api" {
  name          = "TerraformDispatcherAPI"
  protocol_type = "HTTP"

  # CORS configuration to satisfy browser preflight checks from prod site and GitHub preview domains.
  # NOTE: GitHub preview domains change; for a looser dev policy temporarily add "*" then tighten before prod.
  cors_configuration {
    allow_origins  = ["https://dregraham.com", "https://potential-space-computing-machine-9gjvg5445p4f7pwg-3000.app.github.dev"]
    allow_methods  = ["OPTIONS", "GET", "POST"]
    allow_headers  = ["Content-Type", "x-api-key"]
    max_age        = 86400
  }
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                 = aws_apigatewayv2_api.terraform_api.id
  integration_type       = "AWS_PROXY"
  # Hard-coded Lambda invoke ARN to avoid needing extra read permissions for data source.
  integration_uri        = "arn:aws:lambda:us-east-2:895197120905:function:terraform-dispatch-lambda"
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
