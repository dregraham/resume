terraform {
  backend "s3" {
    bucket         = "dre-multicloud-demo-site"
    key            = "multicloud-iac/terraform.tfstate"
    region         = "us-east-2"
    encrypt        = true
    dynamodb_table = "terraform-state-locks"
  }
}
