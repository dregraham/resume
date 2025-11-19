data "aws_dynamodb_table" "multicloud_runs" {
  name = "multicloud_iac_runs"
}

data "aws_dynamodb_table" "terraform_state_locks" {
  name = "terraform-state-locks"
}
