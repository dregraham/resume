
# 🌩️ Multi-Cloud Infrastructure-as-Code Automation

The **Multi-Cloud IaC Automation Project** demonstrates how **Terraform** and **GitHub Actions** can provision, monitor, and destroy temporary cloud environments across **AWS** and **Azure** — all while following modern DevOps security and automation practices.

It simulates how enterprise infrastructure pipelines deploy reproducible cloud environments, export metadata to cloud storage, and automatically tear down unused resources to optimize costs.

...

## 🧠 Features

- 🧩 **Terraform-Driven Infrastructure** — declarative IaC for AWS & Azure resources.  
- 🔁 **CI/CD Automation** — GitHub Actions workflows validate, plan, and apply Terraform changes automatically.  
- 🔐 **Secure Secrets Management** — GitHub Secrets store IAM & Azure credentials, following least-privilege principles.  
- ☁️ **Cross-Cloud Logging** — metadata exported to both AWS S3 (\`dre-multicloud-demo-site\`) and Azure Blob (\`dremulticlouddemosite\`).  
- ⏳ **Ephemeral Environments** — automated countdown destroys resources after a set time to control costs.