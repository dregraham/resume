terraform {
  required_version = ">= 1.4.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4"
    }
  }

  backend "s3" {}
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  type        = string
  default     = "us-east-2"
  description = "AWS region to deploy the ephemeral environment"
}

data "aws_s3_bucket" "logs" {
  bucket = "dre-multicloud-demo-site"
}

output "logs_bucket_name" {
  value = data.aws_s3_bucket.logs.bucket
}
}
