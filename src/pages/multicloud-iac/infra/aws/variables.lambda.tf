variable "github_token" {
  type        = string
  description = "GitHub token with repo and workflow scopes for repository dispatch"
  sensitive   = true
}

variable "github_owner" {
  type        = string
  description = "GitHub organization or user that owns the repository"
  default     = "dregraham"
}

variable "github_repo" {
  type        = string
  description = "GitHub repository name to dispatch workflows against"
  default     = "resume"
}

variable "default_region" {
  type        = string
  description = "Default AWS region passed to the dispatch Lambda"
  default     = "us-east-2"
}

variable "cors_allow_origin" {
  type        = string
  description = "Allowed origin for CORS responses from the dispatch Lambda"
  default     = "*"
}
