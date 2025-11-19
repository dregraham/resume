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
import "./MultiCloudIAC.css";

// Backend API config from environment variables
const TERRAFORM_ENDPOINT =
  process.env.REACT_APP_TERRAFORM_TRIGGER_URL ||
  process.env.REACT_APP_TERRAFORM_API_URL;
const TERRAFORM_API_KEY =
  process.env.REACT_APP_TERRAFORM_TRIGGER_API_KEY ||
  process.env.REACT_APP_TERRAFORM_API_KEY;

const getNodeText = (node) => {
  if (!node) return "";
  if (node.type === "text" && typeof node.value === "string") return node.value;
  if (!Array.isArray(node.children)) return "";
  return node.children.map(getNodeText).join("");
};

export default function MultiCloudIAC() {
  // Core state
  const [status, setStatus] = useState("idle");
  const [logs, setLogs] = useState([]);
  const [showOutputs, setShowOutputs] = useState(false);
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
      setShowOutputs(false);

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
        setShowOutputs(true);
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
              setShowOutputs(false);
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

  // === GitHub README Fetch ===
  const [readmeMarkdown, setReadmeMarkdown] = useState(null);
  const [readmeLoading, setReadmeLoading] = useState(true);
  const [readmeError, setReadmeError] = useState(null);
  const [isReadmeExpanded, setIsReadmeExpanded] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState({});

  useEffect(() => {
    let canceled = false;
    fetch(
      "https://raw.githubusercontent.com/dregraham/resume/main/src/pages/multicloud-iac/README.md"
    )
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch README");
        return r.text();
      })
      .then((text) => {
        if (!canceled) {
          setReadmeMarkdown(text);
          setReadmeLoading(false);
        }
      })
      .catch((err) => {
        if (!canceled) {
          setReadmeError(err.message);
          setReadmeLoading(false);
        }
      });
    return () => {
      canceled = true;
    };
  }, []);

  // === Infra Steps (existing content preserved) ===
  const infraSteps = [
    {
      step: "01",
      title: "The Vision: Multi-Cloud Automation",
      text: (
        <>
          I set out to build a hands-on demo that could automate infrastructure across AWS and Azure using Terraform...
        </>
      ),
      color: "from-orange-400 to-yellow-400",
    },
    // other steps remain unchanged...
  ];

  const HighlightCard = ({ step, title, text, color }) => {
    const isExpanded = expandedSteps[step];

    return (
      <div
        className="relative flex flex-col bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all p-6 cursor-pointer"
        onClick={() =>
          setExpandedSteps((prev) => ({ ...prev, [step]: !prev[step] }))
        }
      >
        <div className="flex items-start gap-6">
          <div
            className={`w-14 h-14 rounded-full bg-gradient-to-br ${color} text-white font-bold flex items-center justify-center text-xl shadow-md`}
          >
            {step}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {title}
            </h3>
            <p className="text-gray-600 text-[1.25rem]">{text}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <SimpleNav />
      <main className="font-inter text-gray-800">
        <section className="text-center py-28">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Multi-Cloud IaC Automation (AWS & Azure)
          </h1>
          <p className="max-w-2xl mx-auto text-lg">
            Trigger a full Terraform deployment, then watch it auto-destroy.
          </p>
        </section>

        <section className="bg-gray-900 text-white py-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-semibold mb-4">Trigger a Deployment</h2>

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
      </main>
    </>
  );
}
