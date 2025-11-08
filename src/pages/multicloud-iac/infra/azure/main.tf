provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "iac_demo" {
  name     = "iac-demo-rg"
  location = "East US"
}

resource "azurerm_storage_account" "iacdemo" {
  name                     = "dregrahamiacdemo"
  resource_group_name      = azurerm_resource_group.iac_demo.name
  location                 = azurerm_resource_group.iac_demo.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  static_website {
    index_document = "index.html"
  }
}

output "azure_site_url" {
  value = azurerm_storage_account.iacdemo.primary_web_endpoint
}
