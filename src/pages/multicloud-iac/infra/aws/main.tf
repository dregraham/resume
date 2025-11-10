#########################################
# Terraform + Providers
#########################################
terraform {
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

variable "aws_region" {
  type        = string
  default     = "us-east-2"
  description = "AWS region to deploy the ephemeral environment"
}

provider "aws" {
  region = var.aws_region
}

#########################################
# Use Existing S3 Bucket for Environment Logs
#########################################
data "aws_s3_bucket" "logs" {
  bucket = "dre-multicloud-demo-site"
}

#########################################
# Ephemeral Environment ID
#########################################
resource "random_pet" "env" {
  length = 2
}

locals {
  env_id           = "mc-env-${random_pet.env.id}"
  env_metadata_key = "env/latest.json"
}

#########################################
# Networking: VPC + Public Subnet + IGW
#########################################
resource "aws_vpc" "env" {
  cidr_block           = "10.42.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name    = "${local.env_id}-vpc"
    Project = "MultiCloud-IaC"
    Owner   = "DreGraham"
    EnvId   = local.env_id
  }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.env.id
  cidr_block              = "10.42.1.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name    = "${local.env_id}-public-subnet" 
    Project = "MultiCloud-IaC"
    Owner   = "DreGraham"
    EnvId   = local.env_id
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.env.id

  tags = {
    Name    = "${local.env_id}-igw"
    Project = "MultiCloud-IaC"
    Owner   = "DreGraham"
    EnvId   = local.env_id
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.env.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name    = "${local.env_id}-public-rt"
    Project = "MultiCloud-IaC"
    Owner   = "DreGraham"
    EnvId   = local.env_id
  }
}

resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

#########################################
# Security Group
#########################################
resource "aws_security_group" "env_sg" {
  name        = "${local.env_id}-sg"
  description = "Security group for ephemeral environment"
  vpc_id      = aws_vpc.env.id

  ingress {
    description = "Allow HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow SSH (optional)"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "${local.env_id}-sg"
    Project = "MultiCloud-IaC"
    Owner   = "DreGraham"
    EnvId   = local.env_id
  }
}
#########################################
# IAM Role + Instance Profile
#########################################

data "aws_iam_role" "multicloud_ec2_role" {
  name = "multicloud_ec2_role"
}

resource "aws_iam_instance_profile" "multicloud_ec2_profile" {
  name = "${local.env_id}-ec2-profile"
  role = data.aws_iam_role.multicloud_ec2_role.name
}

#########################################
# EC2 Instance (Ephemeral Environment)
#########################################
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_instance" "env_vm" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = "t3.micro"
  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.env_sg.id]
  iam_instance_profile        = aws_iam_instance_profile.multicloud_ec2_profile.name
  associate_public_ip_address = true

  user_data = <<-EOF
              #!/bin/bash
              echo "Ephemeral environment started: ${local.env_id}" > /home/ec2-user/health.txt
              EOF

  tags = {
    Name    = "${local.env_id}-instance"
    Project = "MultiCloud-IaC"
    Owner   = "DreGraham"
    EnvId   = local.env_id
  }
}

resource "aws_s3_object" "env_metadata" {
  bucket       = data.aws_s3_bucket.logs.bucket
  key          = local.env_metadata_key
  content_type = "application/json"
  content = jsonencode({
    environment_id     = local.env_id
    provider           = "aws"
    region             = var.aws_region
    vpc_id             = aws_vpc.env.id
    subnet_id          = aws_subnet.public.id
    instance_id        = aws_instance.env_vm.id
    instance_public_ip = aws_instance.env_vm.public_ip
    logs_bucket        = data.aws_s3_bucket.logs.bucket
    metadata_url       = format("https://%s.s3.%s.amazonaws.com/%s", data.aws_s3_bucket.logs.bucket, var.aws_region, local.env_metadata_key)
    created_at_utc     = timestamp()
  })
}

#########################################
# Outputs for JSON Logging & Frontend
#########################################
output "environment_id" {
  description = "Ephemeral environment identifier"
  value       = local.env_id
}

output "vpc_id" {
  value = aws_vpc.env.id
}

output "subnet_id" {
  value = aws_subnet.public.id
}

output "instance_id" {
  value = aws_instance.env_vm.id
}

output "instance_public_ip" {
  value = aws_instance.env_vm.public_ip
}

output "logs_bucket_name" {
  value = data.aws_s3_bucket.logs.bucket
}

output "env_metadata_json" {
  description = "JSON payload describing this environment for cross-cloud logging"
  value = jsonencode({
    environment_id     = local.env_id
    provider           = "aws"
    region             = var.aws_region
    vpc_id             = aws_vpc.env.id
    subnet_id          = aws_subnet.public.id
    instance_id        = aws_instance.env_vm.id
    instance_public_ip = aws_instance.env_vm.public_ip
    logs_bucket        = data.aws_s3_bucket.logs.bucket
    created_at_utc     = timestamp()
  })
  sensitive = false
}

output "env_metadata_url" {
  description = "Public S3 URL hosting the latest environment metadata JSON"
  value       = format("https://%s.s3.%s.amazonaws.com/%s", data.aws_s3_bucket.logs.bucket, var.aws_region, aws_s3_object.env_metadata.key)
}
