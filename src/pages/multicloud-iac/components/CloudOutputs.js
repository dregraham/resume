import React from "react";

const outputs = [
  {
    provider: "AWS",
    color: "#f97316",
    items: [
      { label: "CloudFront CDN", value: "https://aws-demo.cloudfront.net" },
      { label: "S3 Origin", value: "s3://dre-multicloud-iac-demo" }
    ]
  },
  {
    provider: "Azure",
    color: "#3b82f6",
    items: [
      { label: "Azure CDN", value: "https://dre-multicloud.azureedge.net" },
      { label: "Storage Blob", value: "https://multicloudiac.blob.core.windows.net/site" }
    ]
  }
];

export default function CloudOutputs() {
  return (
    <section style={{ width: "100%" }}>
      <h2 style={{ fontSize: "1.75rem", marginBottom: "1.5rem", textAlign: "center", color: "#1f2937" }}>
        Deployment Outputs
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.5rem"
        }}
      >
        {outputs.map((cloud) => (
          <article
            key={cloud.provider}
            style={{
              borderRadius: "14px",
              border: `1px solid rgba(107, 114, 128, 0.22)`,
              background: "#0f172a",
              color: "#e2e8f0",
              padding: "1.5rem",
              boxShadow: "0 18px 30px rgba(15, 23, 42, 0.4)"
            }}
          >
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>{cloud.provider}</h3>
              <span style={{
                display: "inline-block",
                padding: "0.35rem 0.85rem",
                borderRadius: "999px",
                background: cloud.color,
                color: "#0f172a",
                fontWeight: 700,
                fontSize: "0.85rem"
              }}>
                Live
              </span>
            </header>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {cloud.items.map((item) => (
                <li key={item.label} style={{ marginBottom: "0.85rem" }}>
                  <div style={{ fontSize: "0.95rem", fontWeight: 500, marginBottom: "0.15rem" }}>{item.label}</div>
                  <code style={{ background: "rgba(15, 23, 42, 0.7)", padding: "0.4rem 0.6rem", borderRadius: "6px", display: "inline-block" }}>
                    {item.value}
                  </code>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
