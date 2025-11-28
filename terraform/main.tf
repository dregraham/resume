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
  }
}

# ------------------
# PROVIDER
# ------------------
provider "aws" {
  region = "us-east-2"
}

# ------------------
# VPC
# ------------------
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name    = "vpc-${var.request_id}"
    Cleanup = "auto"
  }
  lifecycle {
    prevent_destroy = false
  }
}

# ------------------
# SUBNET
# ------------------
resource "aws_subnet" "main" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "${var.region}a"
  tags = {
    Name    = "subnet-${var.request_id}"
    Cleanup = "auto"
  }
  lifecycle {
    prevent_destroy = false
  }
}

# ------------------
# EC2 Instance
# ------------------
resource "aws_instance" "main" {
  ami           = "ami-0c55b159cbfafe1f0" # Amazon Linux 2 → us-east-2
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.main.id
  tags = {
    Name    = "instance-${var.request_id}"
    Cleanup = "auto"
  }
  lifecycle {
    prevent_destroy = false
  }
}

# ------------------
# S3 Details for Quick Lookup
# ------------------
resource "aws_s3_object" "details" {
  bucket = "dre-multicloud-demo-site"
  key    = "created_envs/${var.request_id}-details.json"
  content = jsonencode({
    vpc_id      = aws_vpc.main.id
    subnet_id   = aws_subnet.main.id
    instance_id = aws_instance.main.id
  })
}

# ------------------
# OUTPUTS
# ------------------
output "vpc_id" {
  value = aws_vpc.main.id
}

output "subnet_id" {
  value = aws_subnet.main.id
}

output "instance_id" {
  value = aws_instance.main.id
}

output "availability_zone" {
  value = aws_subnet.main.availability_zone
}

output "region" {
  value = var.region
}
