import React from "react";
import TerraformSteps from "./components/TerraformSteps";
import WorkflowDiagram from "./components/WorkflowDiagram";
import CloudOutputs from "./components/CloudOutputs";

export default function MultiCloudIAC() {
  return (
    <section
      style={{
        padding: "4rem 1.5rem",
        maxWidth: "1100px",
        margin: "0 auto",
        fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "1rem",
          textAlign: "center",
          fontWeight: 700,
          color: "#1f2937",
        }}
      >
        ☁️ Multi-Cloud IaC Automation
      </h1>

      <p
        style={{
          fontSize: "1.15rem",
          lineHeight: 1.7,
          textAlign: "center",
          color: "#374151",
          marginBottom: "2.5rem",
        }}
      >
        A hands-on DevOps project demonstrating <strong>Infrastructure-as-Code</strong> automation across{" "}
        <strong>AWS</strong> and <strong>Azure</strong> using <strong>Terraform</strong> and{" "}
        <strong>GitHub Actions</strong>. This project provisions live static website environments in both clouds
        through a fully automated CI/CD pipeline.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "3rem",
        }}
      >
        {/* Terraform Steps */}
        <TerraformSteps />

        {/* Workflow Diagram */}
        <WorkflowDiagram />

        {/* Cloud Outputs */}
        <CloudOutputs />
      </div>

      <hr style={{ margin: "4rem 0", border: "1px solid #e5e7eb" }} />

      <div
        style={{
          textAlign: "center",
          fontSize: "1rem",
          color: "#6b7280",
        }}
      >
        <p>
          Explore the source under <code>src/pages/multicloud-iac</code> in the repository to view Terraform configs,
          GitHub Actions workflows, and infrastructure code.
        </p>
        <p>
          Repository:{" "}
          <a
            href="https://github.com/dregraham/resume/tree/main/src/pages/multicloud-iac"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600 }}
          >
            GitHub Source →
          </a>
        </p>
      </div>
    </section>
  );
}
