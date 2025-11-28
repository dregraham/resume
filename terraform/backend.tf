terraform {
  backend "s3" {
    bucket = "cloud-drift-tfstate"
    key    = "cloud-drift-tfstate/cloud-drift-guardrail/terraform.tfstate"
    region = "us-east-2"
  }
}
