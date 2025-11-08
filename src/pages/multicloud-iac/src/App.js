import React from "react";
import TerraformSteps from "./components/TerraformSteps";
import WorkflowDiagram from "./components/WorkflowDiagram";
import CloudOutputs from "./components/CloudOutputs";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>🌐 Multi-Cloud IaC Deployment with CI/CD</h1>
      <p>
        This project simulates how Terraform and GitHub Actions automate
        infrastructure provisioning across AWS and Azure.
      </p>

      <TerraformSteps />
      <WorkflowDiagram />
      <CloudOutputs />
    </div>
  );
}

export default App;
