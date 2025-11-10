import React, { useState, useEffect } from "react";

const TERRAFORM_FILES = {
  aws: "https://raw.githubusercontent.com/dregraham/resume/main/src/pages/multicloud-iac/infra/aws/main.tf",
  azure: "https://raw.githubusercontent.com/dregraham/resume/main/src/pages/multicloud-iac/infra/azure/main.tf"
};

export default function TerraformCode({ deploymentStatus }) {
  const [terraformCode, setTerraformCode] = useState({});
  const [expandedProviders, setExpandedProviders] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTerraformCode = async () => {
      setLoading(true);
      const codeResults = {};

      // Fetch AWS code if deployment exists
      if (deploymentStatus.aws) {
        try {
          const awsResponse = await fetch(TERRAFORM_FILES.aws);
          if (awsResponse.ok) {
            codeResults.aws = await awsResponse.text();
          }
        } catch (err) {
          console.log("Failed to fetch AWS Terraform code:", err.message);
        }
      }

      // Fetch Azure code if deployment exists
      if (deploymentStatus.azure) {
        try {
          const azureResponse = await fetch(TERRAFORM_FILES.azure);
          if (azureResponse.ok) {
            codeResults.azure = await azureResponse.text();
          }
        } catch (err) {
          console.log("Failed to fetch Azure Terraform code:", err.message);
        }
      }

      setTerraformCode(codeResults);
      setLoading(false);
    };

    fetchTerraformCode();
  }, [deploymentStatus]);

  const toggleProvider = (provider) => {
    setExpandedProviders(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  const providers = [];
  if (terraformCode.aws) {
    providers.push({
      name: "AWS",
      key: "aws",
      color: "#f97316",
      icon: "☁️",
      description: "Amazon Web Services Infrastructure"
    });
  }
  if (terraformCode.azure) {
    providers.push({
      name: "Azure", 
      key: "azure",
      color: "#3b82f6",
      icon: "🔷",
      description: "Microsoft Azure Infrastructure"
    });
  }

  if (providers.length === 0) {
    return null; // Don't show section if no deployments
  }

  return (
    <section style={{
      width: "100%",
      backgroundColor: "#f8fafc",
      padding: "2rem 0",
      borderTop: "1px solid #e2e8f0"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ 
            fontSize: "1.75rem", 
            fontWeight: "bold", 
            color: "#1f2937",
            marginBottom: "0.5rem"
          }}>
            Infrastructure as Code
          </h2>
          <p style={{ 
            fontSize: "1rem", 
            color: "#6b7280",
            margin: 0
          }}>
            View the actual Terraform configuration files that created this infrastructure
          </p>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div style={{ color: "#6b7280" }}>Loading Terraform code...</div>
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
          gap: "1.5rem"
        }}>
          {providers.map((provider) => (
            <div
              key={provider.key}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                overflow: "hidden"
              }}
            >
              {/* Header */}
              <div
                onClick={() => toggleProvider(provider.key)}
                style={{
                  padding: "1rem 1.25rem",
                  backgroundColor: "#f9fafb",
                  borderBottom: "1px solid #e5e7eb",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#f3f4f6"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#f9fafb"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{provider.icon}</span>
                  <div>
                    <h3 style={{ 
                      fontSize: "1.1rem", 
                      fontWeight: "600", 
                      margin: 0,
                      color: "#1f2937"
                    }}>
                      {provider.name} Terraform
                    </h3>
                    <p style={{ 
                      fontSize: "0.875rem", 
                      color: "#6b7280", 
                      margin: 0
                    }}>
                      {provider.description}
                    </p>
                  </div>
                </div>
                <div style={{ 
                  fontSize: "1.25rem", 
                  transform: expandedProviders[provider.key] ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s"
                }}>
                  ▼
                </div>
              </div>

              {/* Code Content */}
              {expandedProviders[provider.key] && (
                <div style={{ padding: "0" }}>
                  <pre style={{
                    margin: 0,
                    padding: "1.5rem",
                    backgroundColor: "#1e293b",
                    color: "#e2e8f0",
                    fontSize: "0.875rem",
                    lineHeight: "1.6",
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                    overflow: "auto",
                    maxHeight: "600px"
                  }}>
                    <code>{terraformCode[provider.key]}</code>
                  </pre>
                  
                  {/* Actions */}
                  <div style={{
                    padding: "1rem 1.25rem",
                    backgroundColor: "#f9fafb",
                    borderTop: "1px solid #e5e7eb",
                    display: "flex",
                    gap: "0.75rem"
                  }}>
                    <a
                      href={TERRAFORM_FILES[provider.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "0.875rem",
                        color: provider.color,
                        textDecoration: "none",
                        fontWeight: "500"
                      }}
                    >
                      View on GitHub ↗
                    </a>
                    <button
                      onClick={() => navigator.clipboard.writeText(terraformCode[provider.key])}
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "500"
                      }}
                    >
                      Copy Code
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}