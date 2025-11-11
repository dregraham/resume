# 💼 Dre Graham — Cloud Engineer Portfolio

Welcome to my **Cloud Engineer Portfolio Repository**.  
This repo contains the source code for my professional projects, portfolio website, and cloud demonstrations — all built to showcase my hands-on experience with **AWS, Azure, Python, and React**.


## ⚙️ Terraform Automation

- `.github/workflows/terraform-aws-deploy.yml` lets me run `plan`, `apply`, or `destroy` against `src/pages/multicloud-iac/infra/aws` with remote state and locking.
- Remote state expects an S3 bucket (versioned and encrypted) and a DynamoDB table with a `LockID` string key; point secrets/variables `TF_STATE_BUCKET` and `TF_LOCK_TABLE` at those names.
- The workflow reads AWS credentials from repository secrets (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) and gates destructive runs behind the `aws-terraform` environment for manual approval.
- From the Actions tab choose **Terraform AWS Deploy**, supply the region/action, approve the environment gate, and the job will handle `terraform init`, plan upload, and the final `apply`/`destroy`.
- `.github/workflows/terraform-aws-on-demand.yml` is the button-triggered path: it applies Terraform, waits ~2 minutes, then destroys the stack using a per-request state key so multiple demos can run safely in parallel.
- `aws/terraform-dispatch-lambda/` contains an AWS Lambda helper that the front end calls; it fires a GitHub `repository_dispatch` event with the request ID and state key, keeping PATs off the client.
- The React page reads `REACT_APP_TERRAFORM_TRIGGER_URL`, optional `REACT_APP_TERRAFORM_TRIGGER_API_KEY`, and `REACT_APP_TERRAFORM_REGION` to reach that Lambda/API Gateway; the Lambda needs `GITHUB_WORKFLOW_TOKEN`, `TF_STATE_BUCKET`, and `TF_LOCK_TABLE` already configured in Actions.


## 📂 Source Code Tour

1. `src/pages/CloudHealthDashboard/CloudHealthDashboard.js` – Full featured React dashboard (mock AWS health console). Pairs with dataset JSON files and dark-theme CSS for status visualization.
2. `src/pages/CloudHealthDashboard/backend/lambda_handler.py` – Illustrative Python AWS Lambda handler showing a serverless data shape returned to the front end.
3. `src/pages/DynamoDBInventoryManager/DynamoDBInventoryManager.js` – Work-in-progress scaffold meant for demonstrating DynamoDB-oriented UI & access pattern concepts.
4. `src/pages/LogAnalyzerToolkit/LogAnalyzerToolkit.js` – Stub reserved for log parsing / insight tooling; shows planned expansion structure.

Additional index & guidance: `src/pages/README.md`.


### 📊 Overview
The **Cloud Health Dashboard** is a React-based simulation of the **AWS Service Health Console**.  
It demonstrates how a front-end interface can visualize service uptime, region health, and metric data across multiple AWS services using mock JSON data and simulated Lambda (boto3) interactions.

🧩 Built with:
- React (front-end framework)
- CSS3 (custom portfolio styling)
- JSON (mock service datasets)
- AWS concepts (CloudWatch, Lambda, Health APIs)

🎨 **Key Features:**
- Dynamic health status cards for AWS services  
- Dataset selector (Core, Compute, Security, Databases, DevOps)  
- Interactive modal pop-outs with tabs for Overview, Metrics, and Backend Logs  
- Modern black-and-white portfolio theme  

---

## 🧠 Why I Built It
This project showcases my ability to:
- Translate **AWS architecture concepts** into functional code.  
- Simulate **real-time monitoring** workflows.  
- Design **clean, professional dashboards** aligned with cloud-engineering best practices.

---

## 🔗 View the Project

📂 **Project Folder:**  
[CloudHealthDashboard](https://github.com/dregraham/resume/tree/main/src/pages/CloudHealthDashboard)

💻 **Live Preview:**  
[www.dregraham.com/projects/cloud-health-dashboard](https://dregraham.com/#/projects/cloud-health-dashboard)

📜 **Full README for the Project:**  
[Cloud Health Dashboard Documentation](https://github.com/dregraham/resume/blob/main/src/pages/CloudHealthDashboard/README.md)

---

## 👨‍💻 About Me

I’m **Dre Graham**, a Cloud Engineer passionate about building scalable, observable, and well-designed cloud systems.  
I hold multiple certifications (AWS, Azure, CompTIA, ITIL) and specialize in automation, DevOps tooling, and serverless architecture.

📍 [www.dregraham.com](https://www.dregraham.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/dregraham)  
🔗 [GitHub](https://github.com/dregraham)

---

### 🧾 License
All code and designs are for educational and professional demonstration purposes.
