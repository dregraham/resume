resource "aws_dynamodb_table" "multicloud_runs" {
  name           = "multicloud_iac_runs"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "runId"

  attribute {
    name = "runId"
    type = "S"
  }

  tags = {
    Purpose = "Terraform run tracking"
  }
}
