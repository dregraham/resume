# ☁️ Cloud Health Dashboard

The **Cloud Health Dashboard** is a front-end simulation inspired by the **AWS Service Health Console**.  
It demonstrates how core AWS services (like EC2, S3, DynamoDB, Lambda, and CloudWatch) can be monitored for operational status, metrics, and health insights using React, mock JSON data, and AWS concepts.

---

## 🔍 Project Overview

This dashboard was built as part of my Cloud Engineer portfolio to demonstrate:
- React front-end development and state management.
- Real-world AWS service modeling using **mock JSON datasets**.
- UI design and automation inspired by **AWS Health Dashboard**.
- Cloud concepts such as **monitoring, metrics, region awareness, and service status simulation**.

Users can:
- Select between five AWS service datasets.
- Trigger health refreshes to simulate real-time polling.
- Click on each service to view detailed information in an interactive modal with tabs for:
  - **Overview** (general service info)
  - **Metrics** (simulated CloudWatch metrics)
  - **Backend Logs** (mock Lambda/boto3 insights)

---

## 🧱 Project Structure

```
src/
└── pages/
    └── CloudHealthDashboard/
        ├── backend/
        │   ├── lambda_handler.py
        │   └── requirements.txt
        ├── CloudDashboard.css
        ├── CloudHealthDashboard.js
        ├── README.md
        ├── mockData1_core.json
        ├── mockData2_compute_network.json
        ├── mockData3_security_identity.json
        ├── mockData4_database_analytics.json
        └── mockData5_devops_global.json

```

Each `mockDataX.json` file represents a category of AWS services and includes:
- `status` (Healthy, Degraded, Down)
- `description` (human-readable overview)
- `region` (AWS region code)
- `lastChecked` (timestamp)
- `metrics` (key CloudWatch-style metrics)
- `backend` (simulated Lambda/boto3 logic)

---

## 🧠 Features

- 🧩 **React Functional Components** — dynamic rendering of health cards.
- 📊 **Interactive Pop-Out Modals** — detailed service views with tabbed navigation.
- 🗺️ **Dataset Selector** — switch between AWS service groups (Core, Compute, Security, Databases, DevOps).
- 🕒 **Simulated Status Refresh** — randomizes health states to emulate live API polling.
- 🎨 **Modern Portfolio Styling** — white background, black minimalist borders, and responsive grid layout.
- 💬 **Fully Responsive** — works on all screen sizes.

---

## 🧰 Tech Stack

| Technology | Purpose |
|-------------|----------|
| **React** | Front-end framework |
| **JavaScript (ES6+)** | Core logic and interactivity |
| **CSS3** | Custom portfolio styling |
| **JSON (mock data)** | Simulated AWS service data |
| **AWS Concepts** | Lambda, CloudWatch, Health API, boto3 modeling |

---

## 🚀 How to Run

```bash
# 1. Clone the repository
git clone https://github.com/dregraham/resume.git

# 2. Navigate to the CloudHealthDashboard folder
cd resume/src/pages/CloudHealthDashboard

# 3. Install dependencies (from project root)
npm install

# 4. Run the local development server
npm start
