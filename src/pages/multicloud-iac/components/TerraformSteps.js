import React from "react";

const steps = [
  {
    title: "1. Provision",
    description: "Terraform plans and applies infrastructure for AWS S3 + CloudFront and Azure Storage + CDN in parallel workspaces."
  },
  {
    title: "2. Deploy",
    description: "GitHub Actions builds static assets and pushes them to both clouds using provider-specific Terraform resources."
  },
  {
    title: "3. Verify",
    description: "Outputs expose regional endpoints and CDN URLs so smoke tests can confirm both environments are live."
  }
];

export default function TerraformSteps() {
  return (
    <section style={{ width: "100%" }}>
      <h2 style={{ fontSize: "1.75rem", marginBottom: "1.5rem", color: "#1f2937", textAlign: "center" }}>
        Terraform Workflow
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem"
        }}
      >
        {steps.map((step) => (
          <article
            key={step.title}
            style={{
              background: "#f9fafb",
              padding: "1.5rem",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)"
            }}
          >
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", color: "#2563eb" }}>{step.title}</h3>
            <p style={{ fontSize: "1rem", lineHeight: 1.6, color: "#4b5563" }}>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
