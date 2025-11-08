# Project Pages Overview

This `src/pages` directory contains self-contained feature pages showcased from the portfolio landing page (`/`). Each page focuses on a different facet of cloud engineering, data handling, or system operations. Use this file as an entry point when reviewing the source as an employer or collaborator.

## Directory Structure

```
src/pages/
  CloudHealthDashboard/       # AWS service health style dashboard simulation + mock data + backend sample
  DynamoDBInventoryManager/   # React view demonstrating inventory style interactions (placeholder / WIP)
  LogAnalyzerToolkit/         # React component stub for future log parsing & insights features
```

## 1. Cloud Health Dashboard
Path: `src/pages/CloudHealthDashboard/CloudHealthDashboard.js`

A front‑end simulation of a cloud provider health console. It consumes several mock JSON datasets that emulate grouped AWS service status across regions and domains (core, compute & network, security & identity, databases & analytics, devops/global). A lightweight Python Lambda example (`backend/lambda_handler.py`) illustrates how a serverless function could supply data.

Key artifacts:
- `mockData*.json` – static datasets used to populate dynamic cards & modal views.
- `CloudHealthDashboard.js` – React component orchestrating dataset selection and rendering.
- `CloudDashboard.css` – Styling tailored for dark themed metric grid and modal layout.
- `backend/lambda_handler.py` – Example AWS Lambda handler (illustrative only, not wired in build).

Skills demonstrated:
- State-driven UI for data subsets
- Modular data sourcing pattern (mock → future API)
- Cloud operations empathy (status surfaces, categories, metrics, logs)

## 2. DynamoDB Inventory Manager (WIP)
Path: `src/pages/DynamoDBInventoryManager/DynamoDBInventoryManager.js`

Intended to demonstrate CRUD-style interactions and table modeling patterns you would apply with DynamoDB (partition/sort considerations, item shapes, derived aggregates). Currently a structural placeholder ready for expansion.

Potential roadmap:
- Sample item schema visualization
- Simulated query / scan filters
- Capacity / access pattern hints

## 3. Log Analyzer Toolkit (Stub)
Path: `src/pages/LogAnalyzerToolkit/LogAnalyzerToolkit.js`

Planned toolkit for ingesting structured/semi-structured log lines and surfacing quick insights (frequencies, error clustering, latency buckets). Presently a minimal component stub to anchor future enhancement branches.

Future enhancements:
- Client-side parsing & grep-like filters
- Timeline aggregation chart
- Exportable summarized findings

## Review Tips for Employers
- Start with `CloudHealthDashboard/CloudHealthDashboard.js` to see production-ready patterns.
- Examine `backend/lambda_handler.py` for serverless style & docstring clarity.
- Use GitHub's "Go to file" to jump directly to each path listed above.
- Check commit history for evolution and refactors (naming, component extraction, accessibility tweaks).

## Suggested Next Steps (Tracked in Issues / Roadmap)
- Flesh out DynamoDB manager with mock table + query UI
- Implement log parsing demo with sample log corpus
- Introduce unit tests around data selection logic in dashboard

---
_This README was added to improve repository discoverability for reviewers._
