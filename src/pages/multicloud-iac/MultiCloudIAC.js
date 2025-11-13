import React, { useEffect, useState, useCallback } from "react";
import SimpleNav from "../../Components/SimpleNav";
import CloudOutputs from "./components/CloudOutputs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import "github-markdown-css";
import "highlight.js/styles/github.css";
import "./MultiCloudIAC.css"; // Optional CSS file, same as CloudDashboard.css

// Terraform API configuration is driven by environment variables.
// Ensure your .env contains:
// REACT_APP_TERRAFORM_API_URL=https://.../prod/terraform
// REACT_APP_TERRAFORM_API_KEY=YOUR_KEY_VALUE
// After editing .env you MUST restart the dev server (`npm start`).

// Reserved for future Terraform integration features:
// const TERRAFORM_ENDPOINT = process.env.REACT_APP_TERRAFORM_API_URL;
// const TERRAFORM_API_KEY = process.env.REACT_APP_TERRAFORM_API_KEY;
// const REQUESTED_CLOUDS = ["aws"];
// const POLL_INTERVAL_MS = 5000;
// const AUTODESTROY_SECONDS = 120;
// const FINAL_STATES = new Set([
//   "applied",
//   "destroyed",
//   "failed",
//   "errored",
//   "cancelled",
//   "dispatch_failed",
// ]);
// const APPLY_SUCCESS_STATES = new Set(["applied"]);
// const DESTROY_SUCCESS_STATES = new Set(["destroyed"]);

const getNodeText = (node) => {
  if (!node) return "";
  if (node.type === "text" && typeof node.value === "string") return node.value;
  if (!Array.isArray(node.children)) return "";
  return node.children.map(getNodeText).join("");
};

export default function MultiCloudIAC() {
  const [status, setStatus] = useState("idle");
  const [logs, setLogs] = useState([]);
  const [showOutputs, setShowOutputs] = useState(false);
  const [timer, setTimer] = useState(null);
  const [readmeMarkdown, setReadmeMarkdown] = useState(null);
  const [readmeLoading, setReadmeLoading] = useState(true);
  const [readmeError, setReadmeError] = useState(null);
  const [isReadmeExpanded, setIsReadmeExpanded] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState({
    aws: false,
    azure: false
  });
  const [hasDeploymentAttempt, setHasDeploymentAttempt] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState({});
  const [apiError, setApiError] = useState(null);
  const [lastRequestId, setLastRequestId] = useState(null);
  const [lastStateKey, setLastStateKey] = useState(null);
  const terraformRegion = process.env.REACT_APP_TERRAFORM_REGION || "us-east-2";



  // === Fetch README.md dynamically from GitHub (RAW link) ===
  useEffect(() => {
    let cancelled = false;
    const url =
      "https://raw.githubusercontent.com/dregraham/resume/main/src/pages/multicloud-iac/README.md";
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch README");
        return r.text();
      })
      .then((text) => {
        if (!cancelled) {
          setReadmeMarkdown(text);
          setReadmeLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setReadmeError(err.message || "Error loading README");
          setReadmeLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const dispatchTerraformWorkflow = useCallback(async ({
    mode = "provision",
    requestId,
    stateKey,
    region = terraformRegion
  } = {}) => {
    const endpoint = process.env.REACT_APP_TERRAFORM_TRIGGER_URL;
    if (!endpoint) {
      throw new Error(
        "Terraform trigger URL is not configured. Set REACT_APP_TERRAFORM_TRIGGER_URL in your environment."
      );
    }

    const apiKey = process.env.REACT_APP_TERRAFORM_TRIGGER_API_KEY;
    const headers = {
      "Content-Type": "application/json"
    };

    if (apiKey) {
      headers["x-api-key"] = apiKey;
    }

    const generatedId =
      typeof window !== "undefined" && window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : `mc-${Date.now()}`;

    const effectiveRequestId = requestId || generatedId;
    const effectiveStateKey = stateKey || `multicloud-iac/aws/${effectiveRequestId}.tfstate`;

    let response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          mode,
          requestId: effectiveRequestId,
          stateKey: effectiveStateKey,
          region
        })
      });
    } catch (err) {
      console.error("Failed to reach Terraform trigger endpoint", err);
      throw new Error("Unable to reach Terraform trigger endpoint.");
    }

    if (!response.ok) {
      let message = `Trigger request failed with status ${response.status}`;
      try {
        const errorPayload = await response.json();
        if (errorPayload && typeof errorPayload.message === "string") {
          message = errorPayload.message;
        }
      } catch (parseErr) {
        console.warn("Failed to parse trigger error payload", parseErr);
      }
      throw new Error(message);
    }

    const responseText = await response.text();
    let payload = {};
    if (responseText) {
      try {
        payload = JSON.parse(responseText);
      } catch (parseErr) {
        console.warn("Trigger response was not valid JSON", parseErr);
      }
    }

    return {
      requestId: payload.requestId || effectiveRequestId,
      stateKey: payload.stateKey || effectiveStateKey
    };
  }, [terraformRegion]);

  const startCountdown = useCallback((seconds) => setTimer(seconds), []);

  const triggerDestroyWorkflow = useCallback(async (reason = "auto") => {
    if (!lastRequestId || !lastStateKey) {
      setLogs((prev) => [
        ...prev,
        "No active Terraform environment found. Nothing to destroy."
      ]);
      return;
    }

    setStatus("running");
    setApiError(null);
    setLogs((prev) => [
      ...prev,
      reason === "auto"
        ? "Auto-destroy timer reached zero. Triggering Terraform destroy..."
        : "Destroy requested. Dispatching Terraform destroy workflow..."
    ]);

    try {
      await dispatchTerraformWorkflow({
        mode: "destroy",
        requestId: lastRequestId,
        stateKey: lastStateKey,
        region: terraformRegion
      });
      setLogs((prev) => [
        ...prev,
        "Terraform destroy workflow dispatched to GitHub Actions."
      ]);
    } catch (error) {
      console.error("Destroy dispatch failed", error);
      setApiError(error.message);
      setLogs((prev) => [...prev, "✗ Failed to trigger destroy workflow."]);
    } finally {
      setStatus("idle");
      setTimer(null);
      setShowOutputs(false);
      setDeploymentStatus({ aws: false, azure: false });
      setHasDeploymentAttempt(false);
      setLastRequestId(null);
      setLastStateKey(null);
    }
  }, [dispatchTerraformWorkflow, lastRequestId, lastStateKey, terraformRegion]);

  // === Terraform simulation logic ===
  const terraformRun = useCallback(async (action) => {
    if (action !== "create") {
      return;
    }

    setLogs(["Dispatching Terraform workflow via secure backend..."]);
    setShowOutputs(false);
    setStatus("running");
    setApiError(null);
    setHasDeploymentAttempt(true);

    let dispatchResult;
    try {
      dispatchResult = await dispatchTerraformWorkflow({
        mode: "provision",
        region: terraformRegion
      });
      setLastRequestId(dispatchResult.requestId);
      setLastStateKey(dispatchResult.stateKey);
      setLogs((prev) => [
        ...prev,
        `GitHub Actions workflow queued (request ${dispatchResult.requestId}).`,
        "Terraform will provision resources and automatically destroy them after approximately two minutes."
      ]);
    } catch (error) {
      console.error("Terraform dispatch failed", error);
      setApiError(error.message);
      setLogs((prev) => [...prev, "✗ Failed to trigger Terraform workflow."]);
      setStatus("idle");
      setDeploymentStatus({ aws: false, azure: false });
      return;
    }

    const steps = [
      "Initializing Terraform...",
      "Validating configuration files...",
      "Planning infrastructure changes...",
      "Starting AWS deployment..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLogs((prev) => [...prev, steps[i]]);
    }

    await new Promise((resolve) => setTimeout(resolve, 800));
    setLogs((prev) => [...prev, "✓ AWS: VPC and EC2 instance created successfully"]);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLogs((prev) => [...prev, "✓ AWS: S3 metadata uploaded to bucket"]);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLogs((prev) => [...prev, "🎉 AWS infrastructure deployment completed!"]);

    setDeploymentStatus({ aws: true, azure: false });
    setShowOutputs(true);
    startCountdown(120);
    setStatus("idle");
  }, [dispatchTerraformWorkflow, startCountdown, terraformRegion]);

  // === Timer countdown ===
  useEffect(() => {
    if (timer === null) return;
    if (timer === 0) {
      triggerDestroyWorkflow("auto");
      return;
    }
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer, triggerDestroyWorkflow]);
  const handleDestroyClick = () => {
    triggerDestroyWorkflow("manual");
  };

  // === Highlight Card (for infrastructure steps) ===
  const HighlightCard = ({ step, title, text, color, hasCode, codeDetails, expandedDetails }) => {
    const isExpanded = expandedSteps[step];
    
    const toggleExpanded = () => {
      setExpandedSteps(prev => ({
        ...prev,
        [step]: !prev[step]
      }));
    };

    return (
      <div
        className="relative flex flex-col bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-6 cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex items-start gap-6">
          <div
            className={`flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br ${color} text-white font-bold flex items-center justify-center text-xl shadow-md`}
          >
            {step}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
              <div className="flex items-center gap-2">
                {hasCode && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    📄 Code
                  </span>
                )}
                <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-[1.25rem] leading-relaxed">{text}</p>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in duration-300">
            {expandedDetails && (
              <div className="mb-4">
                <p className="text-gray-700 text-[1.25rem] leading-relaxed">{expandedDetails}</p>
              </div>
            )}
            
            {hasCode && codeDetails && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">📄 Related Infrastructure Code:</h4>
                {codeDetails.map((code, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{code.provider} - {code.filename}</span>
                      <a
                        href={code.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Code ↗
                      </a>
                    </div>
                    <p className="text-xs text-gray-600">{code.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <SimpleNav />
      <main className="font-inter text-gray-800" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        {/* === HERO === */}
        <section className="relative text-center py-28">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 font-inter">
            Multi-Cloud IaC Automation (AWS & Azure)
          </h1>
          <p className="max-w-2xl mx-auto text-gray-800 text-lg leading-relaxed font-inter">
            A hands-on demonstration of automating Infrastructure as Code using
            Terraform, GitHub Actions, and secure IAM integration — deploying
            and destroying infrastructure across AWS and Azure.
          </p>
        </section>

        {/* === HOW THE INFRASTRUCTURE IS CREATED === */}
        <section className="bg-white py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Code Commit Triggers Automation",
                  text: "A developer push to GitHub triggers an automated GitHub Actions workflow orchestrating the entire build sequence.",
                  color: "from-orange-400 to-yellow-400",
                  expandedDetails: "GitHub Actions workflows are defined in .github/workflows/ and use OIDC authentication to securely connect to AWS and Azure without storing long-lived credentials. The workflow triggers on pushes to main branch and runs terraform commands in a containerized environment.",
                  hasCode: false
                },
                {
                  step: "02",
                  title: "Terraform Initializes the Environment",
                  text: "Terraform runs 'init' to authenticate securely via IAM roles in GitHub Secrets — no exposed credentials.",
                  color: "from-pink-500 to-fuchsia-400",
                  expandedDetails: "The initialization phase downloads required providers (AWS, Azure), configures remote state storage in S3, and establishes secure authentication using GitHub's OIDC provider with short-lived tokens.",
                  hasCode: false
                },
                {
                  step: "03",
                  title: "Modules Define Multi-Cloud Resources",
                  text: "Reusable modules define networks, subnets, and storage across AWS and Azure with parameters for region and scale.",
                  color: "from-sky-400 to-cyan-500",
                  expandedDetails: "Infrastructure is defined using HashiCorp Configuration Language (HCL) in modular, reusable components. Each cloud provider has dedicated configuration files that define VPCs, subnets, security groups, compute instances, and storage resources.",
                  hasCode: true,
                  codeDetails: [
                    {
                      provider: "AWS",
                      filename: "main.tf",
                      url: "https://raw.githubusercontent.com/dregraham/resume/main/src/pages/multicloud-iac/infra/aws/main.tf",
                      description: "Defines VPC, EC2 instance, security groups, and S3 bucket for AWS infrastructure"
                    },
                    {
                      provider: "Azure",
                      filename: "main.tf", 
                      url: "https://raw.githubusercontent.com/dregraham/resume/main/src/pages/multicloud-iac/infra/azure/main.tf",
                      description: "Defines resource group, virtual network, and storage account for Azure infrastructure"
                    }
                  ]
                },
                {
                  step: "04",
                  title: "Plan Phase Validates Configuration",
                  text: "Terraform performs 'plan' to preview resource creation, modification, or destruction before execution.",
                  color: "from-indigo-500 to-blue-400",
                  expandedDetails: "The planning phase analyzes the current state, compares it with desired configuration, and generates an execution plan showing exactly what resources will be created, modified, or destroyed. This provides a safety check before making any actual infrastructure changes.",
                  hasCode: false
                },
                {
                  step: "05",
                  title: "Apply Phase Provisions the Infrastructure",
                  text: "Terraform executes the plan, creating resources across both AWS and Azure in parallel.",
                  color: "from-green-400 to-emerald-500",
                  expandedDetails: "During the apply phase, Terraform creates resources in the correct order based on dependencies. It handles parallel creation where possible and manages the resource lifecycle, updating the state file with the actual infrastructure details after successful provisioning.",
                  hasCode: true,
                  codeDetails: [
                    {
                      provider: "AWS",
                      filename: "main.tf",
                      url: "https://raw.githubusercontent.com/dregraham/resume/main/src/pages/multicloud-iac/infra/aws/main.tf",
                      description: "See resource blocks and dependencies that get provisioned during apply"
                    }
                  ]
                },
                {
                  step: "06",
                  title: "Outputs Export Metadata for Monitoring",
                  text: "Once deployed, Terraform exports environment metadata to S3 and Azure Blob for observability and metrics.",
                  color: "from-amber-400 to-yellow-300",
                  expandedDetails: "Output values are defined in the Terraform configuration and automatically exported after successful deployment. These outputs include resource IDs, network details, and endpoint URLs that are stored in cloud storage for consumption by monitoring systems and this web interface.",
                  hasCode: true,
                  codeDetails: [
                    {
                      provider: "AWS",
                      filename: "main.tf (outputs)",
                      url: "https://raw.githubusercontent.com/dregraham/resume/main/src/pages/multicloud-iac/infra/aws/main.tf",
                      description: "View the output blocks that generate the JSON metadata displayed in the demo"
                    }
                  ]
                },
                {
                  step: "07",
                  title: "Lifecycle Policies Handle Auto-Destruction",
                  text: "After a short lifespan (2 minutes in this demo), Terraform 'destroy' tears down resources to prevent costs.",
                  color: "from-rose-400 to-red-400",
                  expandedDetails: "Automated lifecycle management ensures demo resources don't accumulate costs. The destroy process removes all provisioned resources in the correct order, handling dependencies and updating the state file to reflect the clean environment.",
                  hasCode: false
                },
              ].map((item, i) => (
                <HighlightCard key={i} {...item} />
              ))}
            </div>
          </div>
        </section>

        {/* === TERRAFORM SIMULATION === */}
        <section className="bg-gray-900 text-white py-16" style={{ backgroundColor: "#111827" }}>
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-semibold mb-4 text-white font-inter">
              Trigger A Deployment
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400 text-lg mb-10">
              Trigger a Terraform deployment. Observe console as resources are provisioned and destroyed automatically.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => terraformRun("create")}
                disabled={status === "running" || timer !== null}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-md font-medium transition-all duration-200 min-w-[160px]"
              >
                {status === "running" ? "Running..." : "Create Environment"}
              </button>
              <button
                onClick={handleDestroyClick}
                disabled={status === "running" || (!lastRequestId && !timer)}
                className="bg-rose-500 hover:bg-rose-400 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-md font-medium transition-all duration-200 min-w-[160px]"
              >
                {timer !== null
                  ? `Destroying in ${timer}s...`
                  : "Destroy Environment"}
              </button>
            </div>

            {lastRequestId && (
              <p className="text-emerald-300 text-sm mb-2">
                Workflow Request ID: <span className="font-mono">{lastRequestId}</span>
              </p>
            )}
            {apiError && (
              <p className="text-rose-400 text-sm mb-4">
                {apiError}
              </p>
            )}

            <div className="bg-black text-green-400 font-inter text-sm p-5 rounded-lg max-w-3xl mx-auto min-h-[180px] overflow-y-auto border border-gray-700 will-change-contents" style={{ fontFamily: 'Inter, monospace' }}>
              {logs.length === 0 ? (
                <p className="text-gray-500 m-0">
                  Terraform console output will appear here...
                </p>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, i) => (
                    <p key={i} className="m-0">{log}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* === INFRASTRUCTURE OUTPUTS === */}
        {showOutputs && (
          <section className="bg-white py-8" style={{ backgroundColor: "#ffffff" }}>
            <div className="max-w-5xl mx-auto px-6">
              <CloudOutputs 
                deploymentStatus={deploymentStatus} 
                hasDeploymentAttempt={hasDeploymentAttempt}
              />
            </div>
          </section>
        )}



        {/* === README PREVIEW === */}
        <section className="readme-preview-section">
          <h3>MultiCloudIAC README Preview</h3>
          <div
            className={`readme-preview-box markdown-body ${
              isReadmeExpanded ? "expanded" : "collapsed"
            }`}
          >
            {readmeLoading && <p style={{ margin: 0 }}>Loading README...</p>}
            {readmeError && (
              <p style={{ color: "#d73a49", margin: 0 }}>
                Failed to load README: {readmeError}
              </p>
            )}
            {!readmeLoading && !readmeError && readmeMarkdown && (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeSlug,
                  [
                    rehypeAutolinkHeadings,
                    {
                      behavior: "append",
                      properties: { className: ["heading-anchor-link"] },
                      content: (node) => [
                        {
                          type: "element",
                          tagName: "span",
                          properties: { className: ["sr-only"] },
                          children: [
                            {
                              type: "text",
                              value: `Permalink to ${getNodeText(node)}`.trim(),
                            },
                          ],
                        },
                        {
                          type: "element",
                          tagName: "span",
                          properties: {
                            className: ["heading-anchor"],
                            "aria-hidden": "true",
                          },
                          children: [{ type: "text", value: "#" }],
                        },
                      ],
                    },
                  ],
                  rehypeHighlight,
                ]}
              >
                {readmeMarkdown}
              </ReactMarkdown>
            )}
          </div>
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            {!readmeLoading && !readmeError && readmeMarkdown && (
              <button
                type="button"
                className="readme-toggle"
                onClick={() => setIsReadmeExpanded((prev) => !prev)}
              >
                {isReadmeExpanded ? "Collapse README" : "Expand Full README"}
              </button>
            )}
          </div>
          <div style={{ textAlign: "center", marginTop: "0.75rem" }}>
            <a
              href="https://github.com/dregraham/resume/blob/main/src/pages/multicloud-iac/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="readme-preview-link"
            >
              README on GitHub ↗
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
