provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "resume_site" {
  bucket = "dre-multicloud-iac-demo"
  website {
    index_document = "index.html"
  }
  tags = {
    Project = "MultiCloud-IaC"
    Owner   = "DreGraham"
  }
}

output "aws_site_url" {
  value = aws_s3_bucket.resume_site.website_endpoint
}
