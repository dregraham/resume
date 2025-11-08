import React from "react";

const stages = [
  { label: "Commit", detail: "Feature branch merged to main triggers CI pipeline" },
  { label: "CI", detail: "GitHub Actions validates Terraform & runs fmt/validate" },
  { label: "Plan", detail: "Matrix jobs generate AWS/Azure plans for review" },
  { label: "Apply", detail: "Approved runs apply infrastructure in each cloud" },
  { label: "Deploy", detail: "Static assets are published to S3+CloudFront & Azure CDN" }
];

export default function WorkflowDiagram() {
  return (
    <section style={{ width: "100%" }}>
      <h2 style={{ fontSize: "1.75rem", marginBottom: "1.5rem", textAlign: "center", color: "#1f2937" }}>
        CI/CD Release Path
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem"
        }}
      >
        {stages.map((stage, index) => (
          <div key={stage.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                minWidth: 42,
                minHeight: 42,
                borderRadius: "999px",
                background: "linear-gradient(120deg, #6366f1, #2563eb)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "1rem",
                boxShadow: "0 12px 20px rgba(37, 99, 235, 0.2)"
              }}
            >
              {index + 1}
            </div>
            <div
              style={{
                flex: 1,
                padding: "1rem 1.25rem",
                borderRadius: "12px",
                background: "#111827",
                color: "#e5e7eb",
                boxShadow: "0 12px 30px rgba(17, 24, 39, 0.35)"
              }}
            >
              <div style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.35rem" }}>{stage.label}</div>
              <p style={{ margin: 0, fontSize: "0.98rem", lineHeight: 1.6 }}>{stage.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
