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
// Preferred names (update .env accordingly):
//   REACT_APP_TERRAFORM_TRIGGER_URL=https://.../prod/terraform
//   REACT_APP_TERRAFORM_TRIGGER_API_KEY=YOUR_KEY_VALUE
// Backward compatible fallbacks:
//   REACT_APP_TERRAFORM_API_URL
//   REACT_APP_TERRAFORM_API_KEY
// After editing .env you MUST rebuild (`npm run build`) for production.
const TERRAFORM_ENDPOINT =
  process.env.REACT_APP_TERRAFORM_TRIGGER_URL ||
  process.env.REACT_APP_TERRAFORM_API_URL;
const TERRAFORM_API_KEY =
  process.env.REACT_APP_TERRAFORM_TRIGGER_API_KEY ||
  process.env.REACT_APP_TERRAFORM_API_KEY;
// const AUTODESTROY_SECONDS = 120; // removed unused variable

const getNodeText = (node) => {
  if (!node) return "";
  if (node.type === "text" && typeof node.value === "string") return node.value;
  if (!Array.isArray(node.children)) return "";
  return node.children.map(getNodeText).join("");
};

export default function MultiCloudIAC() {
  // All state/hooks at the top (no duplicates)
  const [status, setStatus] = useState("idle");
  const [logs, setLogs] = useState([]);
  const [showOutputs, setShowOutputs] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [readmeMarkdown, setReadmeMarkdown] = useState(null);
  const [readmeLoading, setReadmeLoading] = useState(true);
  const [readmeError, setReadmeError] = useState(null);
  const [isReadmeExpanded, setIsReadmeExpanded] = useState(false);
  const [deploymentStatus] = useState({ aws: false, azure: false });
  const [hasDeploymentAttempt] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState({});
  const [apiError, setApiError] = useState(null);
  const [lastRequestId] = useState(null);
  const terraformRegion = process.env.REACT_APP_TERRAFORM_REGION || "us-east-2";

  // Functions now use only necessary dependencies
  const triggerDestroyWorkflow = useCallback(async (reason = "auto") => {
    // ...existing code...
  }, []); // No dependencies needed, as all state is stable

  const handleDestroyClick = useCallback(() => {
    triggerDestroyWorkflow("manual");
  }, [triggerDestroyWorkflow]);
    // Story-driven infrastructure steps (narrative format)
    const infraSteps = [
      {
        step: "01",
        title: "The Vision: Multi-Cloud Automation",
        text: (
          <>
            I set out to build a hands-on demo that could automate infrastructure across AWS and Azure using Terraform, triggered securely from a web UI or code. The goal: a repeatable, secure, and observable workflow.<br />
            All workflow logic is managed in <a href="https://github.com/dregraham/resume/tree/main/.github/workflows" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>GitHub Actions</a>.
          </>
        ),
        color: "from-orange-400 to-yellow-400",
        expandedDetails: (
          <>
            The first step was designing the folder structure and workflows. All Terraform code lives in dedicated directories for AWS and Azure, and GitHub Actions orchestrate the <a href="https://github.com/dregraham/resume/blob/main/.github/workflows/terraform-aws-deploy.yml" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>build</a>, <a href="https://github.com/dregraham/resume/blob/main/.github/workflows/terraform-aws-deploy.yml" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>plan</a>, and <a href="https://github.com/dregraham/resume/blob/main/.github/workflows/terraform-aws-deploy.yml" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>apply</a> phases. Secrets and OIDC authentication keep everything secure.
          </>
        )
      },
      {
        step: "02",
        title: "Triggering Infrastructure from the Front-End",
        text: (
          <>
            With the front-end wired to the API Gateway, clicking 'Create Environment' sends a secure dispatch to GitHub Actions, which provisions everything you see.<br />
            The Lambda function logic is in <a href="https://github.com/dregraham/resume/tree/main/aws/terraform-dispatch-lambda" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>terraform-dispatch-lambda</a>.
          </>
        ),
        color: "from-pink-500 to-fuchsia-400",
        expandedDetails: (
          <>
            The API Gateway and Lambda receive the request, validate it, and dispatch a repository event. This event starts the Terraform workflow, passing all needed parameters for region, state, and mode.
          </>
        )
      },
      {
        step: "03",
        title: "Infrastructure as Code",
        text: (
          <>
            Terraform code defines VPCs, EC2 instances, storage, and networking for AWS. All configuration is managed in a single <a href="https://github.com/dregraham/resume/blob/main/terraform/main.tf" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>main.tf</a> file.
          </>
        ),
        color: "from-sky-400 to-cyan-500",
        expandedDetails: (
          <>
            The main.tf file includes resource definitions, variables, and outputs. It sets up everything needed for the demo environment in AWS, including security groups and IAM roles.
          </>
        )
      },
      {
        step: "04",
        title: "Planning & Safety Checks",
        text: (
          <>
            Terraform <a href="https://github.com/dregraham/resume/blob/main/.github/workflows/terraform-aws-deploy.yml" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>plan</a> previews all changes before anything is created or destroyed, ensuring no surprises.
          </>
        ),
        color: "from-indigo-500 to-blue-400",
        expandedDetails: (
          <>
            Remote state is stored in S3, and DynamoDB locks prevent race conditions. The plan phase is a safety net, showing exactly what will be created or destroyed.<br />
            <a href="https://github.com/dregraham/resume/blob/main/terraform/backend.tf" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>backend.tf</a>
          </>
        )
      },
      {
        step: "05",
        title: "Provisioning Resources Across Clouds",
        text: (
          <>
            Terraform <a href="https://github.com/dregraham/resume/blob/main/.github/workflows/terraform-aws-deploy.yml" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>apply</a> brings the plan to life, creating VPCs, subnets, EC2 instances, and storage in AWS, and parallel resources in Azure.
          </>
        ),
        color: "from-green-400 to-emerald-500",
        expandedDetails: (
          <>
            The workflow updates the state file and exports outputs for monitoring. All resources are tagged and tracked for easy teardown later.
          </>
        )
      },
      {
        step: "06",
        title: "Exporting Metadata for Observability",
        text: (
          <>
            After deployment, Terraform <a href="https://github.com/dregraham/resume/blob/main/terraform/main.tf" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>outputs</a> environment metadata to S3. This data powers the dashboard and enables monitoring.
          </>
        ),
        color: "from-amber-400 to-yellow-300",
        expandedDetails: (
          <>
            Output values include resource IDs, network details, and endpoint URLs. These are stored in cloud storage and surfaced in the web UI for transparency.
          </>
        )
      },
      {
        step: "07",
        title: "Automatic Teardown & Cost Control",
        text: (
          <>
            To keep costs low, the workflow waits two minutes, then triggers <a href="https://github.com/dregraham/resume/blob/main/.github/workflows/terraform-aws-deploy.yml" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>destroy</a> to tear down all resources. Everything is cleaned up automatically.
          </>
        ),
        color: "from-rose-400 to-red-400",
        expandedDetails: (
          <>
            Lifecycle management ensures no demo resources linger. The destroy phase removes all provisioned resources and updates the state file, leaving a clean slate for the next run.
          </>
        )
      },
    ];
  // No S3 fetch logic here; CloudOutputs handles fetching and displaying S3 data



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
    const endpoint = TERRAFORM_ENDPOINT;
    if (!endpoint) {
      throw new Error(
        "Terraform trigger URL is not configured. Set REACT_APP_TERRAFORM_TRIGGER_URL in your environment."
      );
    }

    const apiKey = TERRAFORM_API_KEY;
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

    // Send the correct event type for terraform-provision
    let response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          event_type: "terraform-provision",
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

  // const startCountdown = useCallback((seconds) => setTimer(seconds), []); // removed unused function
  // === Terraform simulation logic ===
  const terraformRun = useCallback(async (action) => {
    if (action !== "create") return;
    setStatus("running");
    setApiError(null);
    setLogs(["[Provisioning] Dispatching Terraform workflow via secure backend..."]);
    try {
      await dispatchTerraformWorkflow({ mode: "provision", region: terraformRegion });
      setLogs((prev) => [...prev, "[Provisioning] Terraform workflow dispatched."]);
      setStatus("built");
      setCountdown(500);
      setShowOutputs(true);
      // Wait for CloudOutputs to fetch S3 data, then update logs with real IDs
      setLogs((prev) => [
        ...prev,
        "[Provisioning] Environment created. Fetching resource IDs from S3..."
      ]);
      // Start countdown timer (no logs)
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setLogs((prevLogs) => [...prevLogs, "[Destroy] Auto-destroying environment..."]);
            handleDestroyClick();
            setCountdown(null);
            setStatus("idle");
            setShowOutputs(false);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setApiError(error.message);
      setLogs((prev) => [...prev, "✗ Failed to trigger Terraform workflow."]);
      setStatus("idle");
    }
  }, [dispatchTerraformWorkflow, terraformRegion, handleDestroyClick]);




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
              {infraSteps.map((item, i) => (
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
                onClick={async () => {
                  await terraformRun("create");
                }}
                disabled={status === "running" || status === "built"}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-md font-medium transition-all duration-200 min-w-[160px]"
              >
                {status === "running" ? "Running..." : status === "built" ? "Environment Created" : "Create Environment"}
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <button
                  onClick={handleDestroyClick}
                  disabled={status === "running" || (!lastRequestId && countdown == null)}
                  className="bg-rose-500 hover:bg-rose-400 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-md font-medium transition-all duration-200 min-w-[160px]"
                >
                  Delete Environment
                </button>
                {countdown !== null && (
                  <div style={{ color: '#f87171', marginTop: '0.5rem', fontWeight: 500 }}>
                    {countdown} seconds until auto-destroy
                  </div>
                )}
              </div>
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
