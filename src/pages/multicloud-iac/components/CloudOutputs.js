import React, { useState, useEffect } from "react";

// Terraform output URL - real S3 bucket with Terraform state
const AWS_TERRAFORM_OUTPUT_URL = "https://dre-multicloud-demo-site.s3.us-east-2.amazonaws.com/env/latest.json";

export default function CloudOutputs({ deploymentStatus = { aws: false, azure: false }, hasDeploymentAttempt = false }) {
  const [terraformData, setTerraformData] = useState({});
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [error, setError] = useState(null);
  const [verifyState, setVerifyState] = useState({ status: 'idle', message: '' });

  // Component logging for development
  console.log("CloudOutputs rendered with:", { deploymentStatus, terraformData });

  useEffect(() => {
    const fetchTerraformOutputs = async () => {
      // Skip fetching if AWS deployment is not active
      if (!deploymentStatus.aws) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(AWS_TERRAFORM_OUTPUT_URL);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setTerraformData(data);
      } catch (err) {
        console.error("Failed to fetch Terraform outputs:", err);
        setError(`Failed to load deployment data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTerraformOutputs();
  }, [deploymentStatus.aws]);

  const formatTerraformData = (data) => {
    const clouds = [];
    // AWS Environment
    if (data.aws) {
      clouds.push({
        provider: "AWS", 
        region: data.aws.region || "us-east-2",
        color: "#f97316",
        status: "Live",
        lastUpdated: data.aws.created_at_utc,
        items: [
          {
            label: "Environment ID",
            value: data.aws.environment_id,
            description: "Unique deployment identifier"
          },
          {
            label: "VPC Network", 
            value: data.aws.vpc_id,
            description: "Virtual Private Cloud"
          },
          {
            label: "Public Subnet",
            value: data.aws.subnet_id, 
            description: "Public subnet for resources"
          },
          {
            label: "EC2 Instance",
            value: data.aws.instance_id,
            description: "Amazon Linux 2 t3.micro"
          },
          {
            label: "Public IP",
            value: data.aws.instance_public_ip,
            description: "Instance public IP address"
          },
          {
            label: "Logs Bucket",
            value: data.aws.logs_bucket,
            description: "S3 bucket for metadata",
            isLink: true,
            linkUrl: AWS_TERRAFORM_OUTPUT_URL
          }
        ]
      });
    }

    // Azure Environment (when available)
    if (data.azure) {
      clouds.push({
        provider: "Azure",
        region: data.azure.region || "East US 2", 
        color: "#3b82f6",
        status: "Live",
        lastUpdated: data.azure.created_at_utc,
        items: [
          {
            label: "Resource Group",
            value: data.azure.resource_group_name,
            description: "Azure resource container"
          },
          {
            label: "Storage Account", 
            value: data.azure.storage_account_name,
            description: "Azure storage account"
          },
          {
            label: "Website URL",
            value: data.azure.site_url,
            description: "Static website endpoint"
          }
        ]
      });
    }

    return clouds;
  };

  if (loading) {
    return (
      <section style={{ width: "100%", textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: "1rem", color: "#6b7280" }}>
          Loading Terraform deployment outputs...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{ width: "100%", textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: "1rem", color: "#dc2626" }}>
          {error}
        </div>
        <div style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "0.5rem" }}>
          Failed to fetch deployment data. Check network connectivity.
        </div>
      </section>
    );
  }

  const clouds = formatTerraformData(terraformData);

  // Simple reachability probe for public instance IP (best-effort; CORS may block)
  const probeInstance = async (ip) => {
    if (!ip) return;
    setVerifyState({ status: 'verifying', message: 'Probing instance reachability on port 80...' });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      // Using fetch with no-cors; response will be opaque if reachable
  await fetch(`http://${ip}`, { mode: 'no-cors', signal: controller.signal });
      clearTimeout(timeout);
      // Opaque response => treat as success since connection established
      setVerifyState({ status: 'success', message: 'Instance appears reachable (received network response). For full validation, SSH or curl from a terminal).' });
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        setVerifyState({ status: 'timeout', message: 'Timeout: Instance did not respond within 5s. It may be booting, security group blocked, or unreachable.' });
      } else {
        setVerifyState({ status: 'error', message: `Probe failed: ${err.message}` });
      }
    }
  };

  if (clouds.length === 0) {
    return (
      <section style={{ width: "100%", textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: "1rem", color: "#6b7280" }}>
          {hasDeploymentAttempt 
            ? "AWS deployment failed or no infrastructure was provisioned." 
            : "No active AWS infrastructure deployments found."
          }
        </div>
        <div style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "0.5rem" }}>
          {hasDeploymentAttempt 
            ? "Try running 'Create Environment' again to retry AWS deployment."
            : "Run 'Create Environment' above to provision AWS infrastructure."
          }
        </div>
      </section>
    );
  }

  return (
    <section style={{ 
      width: "100%", 
      backgroundColor: "transparent",
      padding: 0,
      margin: 0
    }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "1.5rem",
          justifyContent: "center"
        }}
      >
        {clouds.map((cloud) => (
          <article
            key={cloud.provider}
            style={{
              borderRadius: "12px",
              border: `1px solid rgba(107, 114, 128, 0.22)`,
              background: "#0f172a",
              color: "#e2e8f0",
              padding: "1.25rem",
              boxShadow: "0 8px 16px rgba(15, 23, 42, 0.3)",
              minHeight: "300px"
            }}
          >
            <div style={{ marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>{cloud.provider}</div>
                <span style={{
                  display: "inline-block",
                  padding: "0.25rem 0.6rem",
                  borderRadius: "999px",
                  background: cloud.color,
                  color: "#0f172a",
                  fontWeight: 700,
                  fontSize: "0.75rem"
                }}>
                  {cloud.status}
                </span>
              </div>
              <div style={{ 
                fontSize: "0.8rem", 
                color: "#94a3b8",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {cloud.region}
              </div>
              {cloud.lastUpdated && (
                <div style={{ 
                  fontSize: "0.7rem", 
                  color: "#6b7280",
                  marginTop: "0.25rem"
                }}>
                  Created: {new Date(cloud.lastUpdated).toLocaleString()}
                </div>
              )}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {cloud.items.map((item, index) => (
                <li key={item.label} style={{ marginBottom: index === cloud.items.length - 1 ? "0" : "0.75rem" }}>
                  <div style={{ 
                    fontSize: "0.875rem", 
                    fontWeight: 600, 
                    marginBottom: "0.2rem", 
                    color: "#f1f5f9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start"
                  }}>
                    <span>{item.label}</span>
                    <span style={{ 
                      fontSize: "0.7rem", 
                      color: "#94a3b8",
                      fontWeight: 400,
                      fontStyle: "italic",
                      maxWidth: "40%",
                      textAlign: "right"
                    }}>
                      {item.description}
                    </span>
                  </div>
                  {item.isLink ? (
                    <a 
                      href={item.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        background: "rgba(15, 23, 42, 0.7)", 
                        padding: "0.3rem 0.5rem", 
                        borderRadius: "4px", 
                        display: "block",
                        fontSize: "0.8rem",
                        color: "#10b981",
                        fontFamily: "'Inter', 'JetBrains Mono', 'Consolas', monospace",
                        wordBreak: "break-all",
                        textDecoration: "none",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "rgba(16, 185, 129, 0.2)";
                        e.target.style.borderColor = "#10b981";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(15, 23, 42, 0.7)";
                        e.target.style.borderColor = "rgba(16, 185, 129, 0.3)";
                      }}
                    >
                      {item.value} ↗
                    </a>
                  ) : (
                    <code style={{ 
                      background: "rgba(15, 23, 42, 0.7)", 
                      padding: "0.3rem 0.5rem", 
                      borderRadius: "4px", 
                      display: "block",
                      fontSize: "0.8rem",
                      color: "#10b981",
                      fontFamily: "'Inter', 'JetBrains Mono', 'Consolas', monospace",
                      wordBreak: "break-all"
                    }}>
                      {item.value}
                    </code>
                  )}
                </li>
              ))}
            </ul>
            
            {/* Add inspection link for AWS */}
            {cloud.provider === "AWS" && (
              <div style={{ 
                marginTop: "1rem", 
                paddingTop: "0.75rem", 
                borderTop: "1px solid rgba(107, 114, 128, 0.3)"
              }}>
                <a
                  href={AWS_TERRAFORM_OUTPUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.8rem",
                    color: "#10b981",
                    textDecoration: "none",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem"
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                  </svg>
                  View Raw Terraform Output (JSON)
                </a>
                {/* Instance reachability validator */}
                {cloud.items.some(i => i.label === 'Public IP') && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const ipItem = cloud.items.find(i => i.label === 'Public IP');
                        probeInstance(ipItem?.value);
                      }}
                      style={{
                        background: '#10b981',
                        color: '#0f172a',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '0.45rem 0.75rem',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        letterSpacing: '0.5px'
                      }}
                      disabled={verifyState.status === 'verifying'}
                    >
                      {verifyState.status === 'verifying' ? 'Probing...' : 'Verify Instance Reachability'}
                    </button>
                    {verifyState.status !== 'idle' && (
                      <div style={{
                        marginTop: '0.5rem',
                        fontSize: '0.65rem',
                        lineHeight: 1.3,
                        color: verifyState.status === 'success' ? '#10b981' : verifyState.status === 'error' ? '#f87171' : verifyState.status === 'timeout' ? '#fbbf24' : '#94a3b8'
                      }}>
                        {verifyState.message}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
