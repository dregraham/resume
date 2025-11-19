terraform {
  backend "s3" {
    bucket         = "dres-terraform-state-bucket"
    key            = "shared/terraform.tfstate"
    region         = "us-east-2"
    encrypt        = true
    dynamodb_table = "terraform-state-locks"
  }
}
