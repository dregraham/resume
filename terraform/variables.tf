#####################
# GitHub Parameters #
#####################

variable "github_token" {
  description = "GitHub token with repo + workflow scopes"
  type        = string
}

variable "expires_at" {
  description = "UTC expiry timestamp for ephemeral environments"
  type        = string
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
  default     = "us-east-2"
}

############################
# Optional Meta Tag        #
############################

variable "created_by" {
  description = "Who created the environment"
  type        = string
  default     = "GitHubActions"
}
