variable "aws_region" {
  description = "AWS region for shared Terraform infrastructure"
  type        = string
  default     = "us-east-2"
}

variable "github_token" {
  description = "GitHub token with repo + workflow scopes"
  type        = string
  sensitive   = true
}

variable "github_owner" {
  description = "GitHub organization or user owning the repository"
  type        = string
  default     = "dregraham"
}

variable "github_repo" {
  description = "GitHub repository name to target for workflow dispatch"
  type        = string
  default     = "resume"
}

variable "default_region" {
  description = "Default AWS region passed to the dispatch Lambda"
  type        = string
  default     = "us-east-2"
}

variable "cors_allow_origin" {
  description = "Allowed origin for dispatch API CORS responses"
  type        = string
  default     = "*"
}

variable "existing_api_id" {
  description = "If set, reuse this existing API Gateway HTTP API instead of creating a new one"
  type        = string
  default     = "1c5u47evyg"
}
