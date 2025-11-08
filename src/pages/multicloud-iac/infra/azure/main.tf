provider "azurerm" {
  features {}
  resource_provider_registrations = "none"
}

resource "azurerm_storage_account" "iacdemo" {
  name                     = "dregrahamiacdemo"
  resource_group_name      = azurerm_resource_group.iac_demo.name
  location                 = azurerm_resource_group.iac_demo.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

# Static website configuration (separate resource)
resource "azurerm_storage_account_static_website" "iacdemo_site" {
  storage_account_id = azurerm_storage_account.iacdemo.id
  index_document      = "index.html"
}

output "azure_site_url" {
  value = azurerm_storage_account_static_website.iacdemo_site.primary_web_endpoint
}
