variable "project" {
  description = "Project name prefix"
  type        = string
  default     = "hwte"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "East US"
}

variable "frontend_image" {
  description = "Front-end image name in ACR"
  type        = string
}

variable "frontend_tag" {
  description = "Tag for the front-end image"
  type        = string
  default     = "latest"
}

variable "backend_image" {
  description = "Back-end image name in ACR"
  type        = string
}

variable "backend_tag" {
  description = "Tag for the back-end image"
  type        = string
  default     = "latest"
}

variable "backend_url" {
  description = "URL of the back-end service"
  type        = string
}

variable "azuresql_connection_string" {
  description = "Azure SQL connection string"
  type        = string
  sensitive   = true
}

variable "cosmos_db_endpoint" {
  description = "Cosmos DB endpoint"
  type        = string
}

variable "cosmos_db_key" {
  description = "Cosmos DB key"
  type        = string
  sensitive   = true
}
