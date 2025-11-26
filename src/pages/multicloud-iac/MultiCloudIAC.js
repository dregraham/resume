import React, { useState, useCallback } from "react";
import SimpleNav from "../../Components/SimpleNav";








import "./MultiCloudIAC.css";

// Backend API config from environment variables
const TERRAFORM_ENDPOINT =
  process.env.REACT_APP_TERRAFORM_TRIGGER_URL ||
  process.env.REACT_APP_TERRAFORM_API_URL;
const TERRAFORM_API_KEY =
  process.env.REACT_APP_TERRAFORM_TRIGGER_API_KEY ||
  process.env.REACT_APP_TERRAFORM_API_KEY;



export default function MultiCloudIAC() {
  // Core state
  const [status, setStatus] = useState("idle");
  const [logs, setLogs] = useState([]);

  const [countdown, setCountdown] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [lastRequestId, setLastRequestId] = useState(null); // Track provisioned env
  const terraformRegion =
    process.env.REACT_APP_TERRAFORM_REGION || "us-east-2";

  // === Destroy Workflow Trigger ===
  const triggerDestroyWorkflow = useCallback(
    async (reason = "auto") => {
      if (!lastRequestId) {
        setLogs((prev) => [...prev, "✗ No environment available to destroy."]);
        return;
      }

      setLogs((prev) => [
        ...prev,
        `[Destroy] Dispatching Terraform destroy workflow (${reason})...`,
      ]);

      setStatus("running");


      try {
        const headers = { "Content-Type": "application/json" };
        if (TERRAFORM_API_KEY) headers["x-api-key"] = TERRAFORM_API_KEY;

        const response = await fetch(TERRAFORM_ENDPOINT, {
          method: "POST",
          headers,
          body: JSON.stringify({
            event_type: "terraform-destroy",
            mode: "destroy",
            requestId: lastRequestId,
            stateKey: `multicloud-iac/aws/${lastRequestId}.tfstate`,
            region: terraformRegion,
          }),
        });

        if (!response.ok)
          throw new Error(`Destroy failed (status ${response.status})`);

        setLogs((prev) => [
          ...prev,
          "[Destroy] Terraform destroy workflow dispatched.",
        ]);
        setStatus("idle");
        setLastRequestId(null);
      } catch (error) {
        setLogs((prev) => [...prev, `✗ Destroy failed: ${error.message}`]);
        setApiError(error.message);
        setStatus("idle");
      }
    },
    [terraformRegion, lastRequestId]
  );

  const handleDestroyClick = useCallback(() => {
    triggerDestroyWorkflow("manual");
  }, [triggerDestroyWorkflow]);

  // === Provision Workflow Trigger ===
  const dispatchTerraformWorkflow = useCallback(
    async ({
      mode = "provision",
      requestId,
      stateKey,
      region = terraformRegion,
    } = {}) => {
      if (!TERRAFORM_ENDPOINT)
        throw new Error(
          "Terraform trigger URL is not configured. Set REACT_APP_TERRAFORM_TRIGGER_URL."
        );

      const headers = { "Content-Type": "application/json" };
      if (TERRAFORM_API_KEY) headers["x-api-key"] = TERRAFORM_API_KEY;

      const generatedId =
        typeof window !== "undefined" && window.crypto?.randomUUID
          ? window.crypto.randomUUID()
          : `mc-${Date.now()}`;

      const effectiveRequestId = requestId || generatedId;
      const effectiveStateKey =
        stateKey ||
        `multicloud-iac/aws/${effectiveRequestId}.tfstate`;

      const response = await fetch(TERRAFORM_ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify({
          event_type: "terraform-provision",
          mode,
          requestId: effectiveRequestId,
          stateKey: effectiveStateKey,
          region,
        }),
      });

      if (!response.ok)
        throw new Error(`Provision failed (status ${response.status})`);

      return { requestId: effectiveRequestId, stateKey: effectiveStateKey };
    },
    [terraformRegion]
  );

  // === Terraform Run Handler ===
  const terraformRun = useCallback(
    async (action) => {
      if (action !== "create") return;
      setStatus("running");
      setApiError(null);
      setLogs([
        "[Provisioning] Dispatching Terraform workflow via secure backend...",
      ]);

      try {
        const result = await dispatchTerraformWorkflow({
          mode: "provision",
          region: terraformRegion,
        });

        setLastRequestId(result.requestId);
        setLogs((prev) => [...prev, "[Provisioning] Workflow dispatched."]);
        setStatus("built");
        setCountdown(500);

        // Auto-destroy after countdown
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev === 1) {
              clearInterval(interval);
              setLogs((prev) => [...prev, "[Destroy] Auto-destroying..."]);
              triggerDestroyWorkflow("auto");
              setCountdown(null);
              setStatus("idle");
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (error) {
        setLogs((prev) => [
          ...prev,
          `✗ Failed to trigger Terraform: ${error.message}`,
        ]);
        setApiError(error.message);
        setStatus("idle");
      }
    },
    [dispatchTerraformWorkflow, terraformRegion, triggerDestroyWorkflow]
  );

  const [isBlurbExpanded, setIsBlurbExpanded] = useState(false);



  // === Infra Steps ===
  const infraSteps = [
    {
      step: "01",
      title: "Multi-Cloud Infrastructure as Code",
      text: "Terraform configurations for AWS and Azure with automated provisioning, state management, and resource cleanup through GitHub Actions workflows.",
      color: "from-orange-400 to-yellow-400",
    },
    {
      step: "02",
      title: "Automated Deployment Pipeline",
      text: "GitHub Actions workflows trigger Terraform operations with remote state storage in S3, DynamoDB locking, and environment-based approvals for production safety.",
      color: "from-blue-400 to-purple-400",
    },
    {
      step: "03",
      title: "Secure API Integration",
      text: "AWS Lambda functions handle deployment requests with API Gateway, proper authentication, and request ID tracking for parallel environment management.",
      color: "from-green-400 to-teal-400",
    },
    {
      step: "04",
      title: "Auto-Destroy & Cost Control",
      text: "Built-in countdown timer automatically destroys demo environments after 8 minutes to prevent unnecessary cloud costs while maintaining full functionality demonstration.",
      color: "from-red-400 to-pink-400",
    }
  ];



  return (
    <>
      <SimpleNav />
      <main className="font-inter text-gray-800">
        <section className="text-center py-20">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6" style={{ fontFamily: 'desyrelregular, serif' }}>
            Multi-Cloud IaC Automation
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-8">
            Automated infrastructure provisioning across AWS and Azure using Terraform, GitHub Actions, and serverless integration with auto-destroy functionality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://github.com/dregraham/resume/tree/main/src/pages/multicloud-iac" target="_blank" rel="noopener noreferrer" 
               className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium">
              View Source Code
            </a>
            <button onClick={() => document.querySelector('.bg-gray-900').scrollIntoView({behavior: 'smooth'})} 
                    className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-50 transition-colors font-medium">
              Try Live Demo
            </button>
          </div>
        </section>

        {/* === STEPS SECTION === */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-5xl font-bold text-center mb-12" style={{ fontFamily: 'desyrelregular, serif' }}>How It Works</h2>
            <div className="grid gap-6">
              {infraSteps.map((item) => (
                <div key={item.step} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-start gap-6">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${item.color} text-white font-bold flex items-center justify-center text-xl shadow-md flex-shrink-0`}>
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-900 text-white py-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-5xl font-semibold mb-4 text-white" style={{ fontFamily: 'desyrelregular, serif' }}>Live Demo</h2>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => terraformRun("create")}
                disabled={status === "running" || status === "built"}
                className="bg-emerald-500 hover:bg-emerald-400 px-6 py-3 rounded-md"
              >
                {status === "running"
                  ? "Running..."
                  : status === "built"
                  ? "Environment Created"
                  : "Create Environment"}
              </button>

              <div className="flex flex-col items-center">
                <button
                  onClick={handleDestroyClick}
                  disabled={status === "running" || !lastRequestId}
                  className="bg-rose-500 hover:bg-rose-400 px-6 py-3 rounded-md"
                >
                  Delete Environment
                </button>
                {countdown !== null && (
                  <div className="text-red-300 mt-2">{countdown}s until auto-destroy</div>
                )}
              </div>
            </div>

            {lastRequestId && (
              <p className="text-emerald-300 text-sm">
                Request ID: <span className="font-mono">{lastRequestId}</span>
              </p>
            )}

            {apiError && <p className="text-red-400">{apiError}</p>}

            <div className="bg-black text-green-400 p-5 rounded-lg min-h-[180px] max-w-3xl mx-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500">Terraform console output will appear here...</p>
              ) : (
                logs.map((log, i) => <p key={i}>{log}</p>)
              )}
            </div>
          </div>
        </section>

        {/* === HOW I BUILT THIS BLURB === */}
        <div className={`how-built-blurb ${isBlurbExpanded ? 'expanded' : ''}`} onClick={() => setIsBlurbExpanded(!isBlurbExpanded)}>
          <h3>The Build Story {isBlurbExpanded ? '\u2212' : '+'}</h3>
          {isBlurbExpanded && (
            <div className="blurb-story" style={{ maxHeight: 320, overflowY: 'auto', paddingRight: 8 }}>
              <p><strong>Overall Challenge:</strong> <br/>
                Show how Terraform can be applied to create environments in AWS and Azure with automated provisioning, state management, and cost controls for live demonstrations.
              </p>
              <p><strong>GitHub Actions Workflow Issues:</strong> <br/>
                The terraform-provision.yml had YAML syntax errors with missing closing tags and indentation issues. Spent hours debugging workflow failures before discovering the malformed structure.
              </p>
              <p><strong>AWS Infrastructure Setup:</strong> <br/>
                Had to manually create the supporting AWS infrastructure - an S3 bucket for Terraform state storage, a DynamoDB table for state locking, and API Gateway endpoints. The Lambda dispatch function required careful IAM permissions to trigger GitHub workflows securely.
              </p>
              <p><strong>State Collision Problems:</strong> <br/>
                Multiple demo requests were conflicting with shared Terraform state. Had to implement unique state keys per request ID in the Terraform configuration to allow parallel deployments without conflicts.
              </p>
              <p><strong>Security Architecture:</strong> <br/>
                Initially tried putting GitHub PATs directly in the React frontend - a major security flaw. Had to build an AWS Lambda proxy with API Gateway authentication to safely trigger repository dispatch events without exposing credentials.
              </p>
              <p><strong>Cost Control Implementation:</strong> <br/>
                The biggest challenge was preventing forgotten demo environments from racking up AWS costs. Implemented an auto-destroy countdown timer with edge case handling for manual cleanup scenarios.
              </p>
              <p><strong>Final Architecture:</strong> <br/>
                Terraform modules with remote S3 state → GitHub Actions workflows → Lambda API proxy → React frontend with real-time status tracking. Result: Production-ready infrastructure automation with zero runaway costs.
              </p>
            </div>
          )}
        </div>

        {/* === README LINK === */}
        <section className="py-16 bg-white">
          <div className="text-center">
            <a
              href="https://github.com/dregraham/resume/blob/main/src/pages/multicloud-iac/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              README.md →
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
