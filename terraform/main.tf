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

}


provider "aws" {
  region = var.default_region
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "main-vpc"
  }
  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_subnet" "main" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "${var.default_region}a"
  tags = {
    Name = "main-subnet"
  }
  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_instance" "main" {
  ami           = "ami-0c55b159cbfafe1f0" # Amazon Linux 2 AMI for us-east-2
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.main.id
  tags = {
    Name = "main-ec2-instance"
  }
  lifecycle {
    prevent_destroy = false
  }
}

resource "null_resource" "delay_destroy" {
  triggers = {
    vpc_id     = aws_vpc.main.id
    subnet_id  = aws_subnet.main.id
    instance_id = aws_instance.main.id
  }

  provisioner "local-exec" {
    command = "powershell -Command \"Start-Sleep -Seconds 120\""
  }
}

# To destroy only VPC, subnet, and EC2 with a delay, run:
# terraform destroy -target=aws_instance.main -target=aws_subnet.main -target=aws_vpc.main -target=null_resource.delay_destroy
# The null_resource will enforce a 2-minute delay before destroy.
resource "aws_s3_object" "details" {
  bucket = "dre-multicloud-demo-site"
  key    = "details.json"
  content = jsonencode({
    vpc_id     = aws_vpc.main.id
    subnet_id  = aws_subnet.main.id
    instance_id = aws_instance.main.id
  })
}
