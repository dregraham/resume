resource "aws_dynamodb_table" "run_status" {
  name         = "terraform-run-status"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "runId"

  attribute {
    name = "runId"
    type = "S"
  }
}
