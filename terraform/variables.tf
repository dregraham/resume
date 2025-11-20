#####################
# GitHub Parameters #
#####################

variable "github_token" {
  description = "GitHub token with repo + workflow scopes"
  type        = string
  sensitive   = true
}

variable "github_owner" {
  description = "GitHub organization or user owning the repo"
  type        = string
  default     = "dregraham"
}

variable "github_repo" {
  description = "GitHub repo name"
  type        = string
  default     = "resume"
}

#########################
# Environment Variables #
#########################

variable "request_id" {
  description = "Unique environment request ID (passed from workflow)"
  type        = string
}

variable "state_key" {
  description = "Terraform state path in S3"
  type        = string
}

variable "region" {
  description = "AWS region for provisioning"
  type        = string
}

############################
# Optional Meta Tags       #
############################

variable "created_by" {
  description = "Who created the environment"
  type        = string
  default     = "GitHubActions"
}

variable "expires_at" {
  description = "UTC timestamp when environment expires"
  type        = string
}
