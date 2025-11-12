
Fix Create Environment button functionality
Nov 12
·
dregraham/resume
·
main
·
+17
-4

Archive

Share

Create PR


user attachment image
user attachment image
I am having trouble with the "Create Environment" button on my multicloudiac.js page at https://dregraham.com/#/projects/multicloud-iac. Here is what happens: 

The page loads and I immediately see the Terraform fetched and  a run "queued". However, it never moves out of this stage and the user only sees "STATUS: QUEUED" with a runid. 

Here is what I want: 

When the Create Environment button is clicked, the terraform creates the environment and waits 2 minutes before it is destroyed (or the user can click the "Destroy Environment" button to escape the "waiting period".). I have included a screenshot of the DeveloperTools and a screenshot of what the UI looks like. Also, when I have DeveloperTools open the page will not reload.
Copy

Version 1

Version 2

Version 3

Version 4
Summary

Updated Terraform polling logic to align with backend status names, recognizing applied/destroyed as successful terminal states and clearing timers for other outcomes so the UI advances correctly.

Testing

⚠️ npm test -- --watchAll=false *(fails: Cannot find module 'react-router-dom' from 'src/Components/Projects.js')*


File (1)

src/pages/multicloud-iac/MultiCloudIAC.js
+17
-4



Diff
Logs

src/pages/multicloud-iac/MultiCloudIAC.js
+17
-4

import React, { useEffect, useState, useCallback, useRef } from "react";
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
const TERRAFORM_ENDPOINT = process.env.REACT_APP_TERRAFORM_API_URL;
const TERRAFORM_API_KEY = process.env.REACT_APP_TERRAFORM_API_KEY;
const REQUESTED_CLOUDS = ["aws"];
const POLL_INTERVAL_MS = 5000;
const AUTODESTROY_SECONDS = 120;
const FINAL_STATES = new Set(["succeeded", "failed", "errored", "cancelled", "destroyed"]);
const FINAL_STATES = new Set([
  "applied",
  "destroyed",
  "failed",
  "errored",
  "cancelled",
  "dispatch_failed",
]);
const APPLY_SUCCESS_STATES = new Set(["applied"]);
const DESTROY_SUCCESS_STATES = new Set(["destroyed"]);

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
  const [currentAction, setCurrentAction] = useState(null);
  const [apiError, setApiError] = useState(null);
@@ -87,75 +96,79 @@ export default function MultiCloudIAC() {
      pollerRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    (runId, action) => {
      stopPolling();

      const poll = async () => {
        try {
          const headers = TERRAFORM_API_KEY ? { "x-api-key": TERRAFORM_API_KEY } : {};
          const res = await fetch(`${TERRAFORM_ENDPOINT}?runId=${encodeURIComponent(runId)}`, { headers });
          if (res.status === 404) return; // run not yet recorded
          if (!res.ok) throw new Error(`Polling failed (${res.status})`);

          const data = await res.json();
          if (typeof data.logs === "string") {
            const lines = data.logs.split(/\r?\n/).filter((line) => line.trim().length > 0);
            setLogs(lines);
          }

          if (typeof data.status === "string") {
            const normalized = data.status.toLowerCase();
            setStatus(normalized);

            if (normalized === "running" || normalized === "queued") {
            if (normalized === "running" || normalized === "queued" || normalized === "in_progress") {
              return;
            }

            if (FINAL_STATES.has(normalized)) {
              stopPolling();
              setCurrentAction(null);

              if (action === "apply" && normalized === "succeeded") {
              if (action === "apply" && APPLY_SUCCESS_STATES.has(normalized)) {
                setDeploymentStatus({
                  aws: REQUESTED_CLOUDS.includes("aws"),
                  azure: REQUESTED_CLOUDS.includes("azure"),
                });
                setShowOutputs(true);
                setHasDeploymentAttempt(true);
                autoDestroyTriggeredRef.current = false;
                setTimer(AUTODESTROY_SECONDS);
              }

              if (action === "destroy" && (normalized === "succeeded" || normalized === "destroyed")) {
              if (action === "destroy" && DESTROY_SUCCESS_STATES.has(normalized)) {
                setDeploymentStatus({ aws: false, azure: false });
                setShowOutputs(false);
                setHasDeploymentAttempt(false);
                setTimer(null);
              }

              if (!APPLY_SUCCESS_STATES.has(normalized) && !DESTROY_SUCCESS_STATES.has(normalized)) {
                setTimer(null);
              }
            }
          }
        } catch (err) {
          console.error("Terraform polling error:", err);
          setApiError(err.message);
        }
      };

      poll();
      pollerRef.current = setInterval(poll, POLL_INTERVAL_MS);
    },
    [stopPolling]
  );

  const triggerTerraform = useCallback(
    async (action) => {
      if (!TERRAFORM_ENDPOINT) {
        setApiError("Terraform API URL missing. Set REACT_APP_TERRAFORM_API_URL in your .env and restart the dev server.");
        return;
      }
      if (!TERRAFORM_API_KEY) {
        setApiError("Terraform API key missing. Set REACT_APP_TERRAFORM_API_KEY in your .env and restart the dev server.");
        return;
      }

