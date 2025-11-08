import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import 'github-markdown-css';
import 'highlight.js/styles/github.css';
import "./CloudDashboard.css";
import SimpleNav from "../../Components/SimpleNav";
import coreData from "./mockData1_core.json";
import computeNetworkData from "./mockData2_compute_network.json";
import securityData from "./mockData3_security_identity.json";
import databaseData from "./mockData4_database_analytics.json";
import devopsData from "./mockData5_devops_global.json";

const getNodeText = (node) => {
  if (!node) return "";
  if (node.type === "text" && typeof node.value === "string") {
    return node.value;
  }
  if (!Array.isArray(node.children)) {
    return "";
  }
  return node.children.map(getNodeText).join("");
};


export default function CloudHealthDashboard() {
  const [selectedDataset, setSelectedDataset] = useState("core");
  const [services, setServices] = useState(coreData);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  // README markdown preview state (full file, GitHub-like styling)
  const [readmeMarkdown, setReadmeMarkdown] = useState(null);
  const [readmeLoading, setReadmeLoading] = useState(true);
  const [readmeError, setReadmeError] = useState(null);
  const [isReadmeExpanded, setIsReadmeExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const url = "https://raw.githubusercontent.com/dregraham/resume/main/src/pages/CloudHealthDashboard/README.md";
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error("Failed to fetch README");
        return r.text();
      })
      .then(text => {
        if (!cancelled) {
          setReadmeMarkdown(text);
          setReadmeLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setReadmeError(err.message || 'Error loading README');
          setReadmeLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const handleDatasetChange = (e) => {
    const value = e.target.value;
    setSelectedDataset(value);

    switch (value) {
      case "core":
        setServices(coreData);
        break;
      case "compute_network":
        setServices(computeNetworkData);
        break;
      case "security_identity":
        setServices(securityData);
        break;
      case "database_analytics":
        setServices(databaseData);
        break;
      case "devops_global":
        setServices(devopsData);
        break;
      default:
        setServices(coreData);
        break;
    }
  };

  const refreshStatus = () => {
    setLoading(true);
    setTimeout(() => {
      const updated = services.map((s) => ({
        ...s,
        status: ["Healthy", "Degraded", "Down"][Math.floor(Math.random() * 3)],
        lastChecked: new Date().toISOString()
      }));
      setServices(updated);
      setLoading(false);
      setLastUpdated(new Date().toLocaleTimeString());
    }, 1000);
  };

  return (
    <>
      <SimpleNav />
      <div style={{ height: 36 }} />

      <section id="top" className="dashboard-container">
        {/* === HOW IT WORKS === */}
        <div className="section-box info-section">
          <h2>How This Works</h2>
          <p>
            The <strong>Cloud Health Dashboard</strong> simulates an AWS Service
            Health Console. Each card represents a service, showing region,
            metrics, and health state. 
			<br/>
			Click a card to open an interactive
            pop-out view with tabs for Overview, Metrics, and Backend Logs.
          </p>

          {/* Dataset Selector */}
 <div className="dataset-section">
  <hr className="dataset-divider" />
  <div className="dataset-selector">
    <label htmlFor="dataset-select">Select Dataset:</label>
    <select
      id="dataset-select"
      value={selectedDataset}
      onChange={handleDatasetChange}
    >
      <option value="core">Core Services</option>
      <option value="compute_network">Compute & Network</option>
      <option value="security_identity">Security & Identity</option>
      <option value="database_analytics">Database & Analytics</option>
      <option value="devops_global">DevOps & Global</option>
    </select>
  </div>
</div>


          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              onClick={refreshStatus}
              disabled={loading}
              className="refresh-button"
            >
              {loading ? "Checking..." : "Run Health Check"}
            </button>
          </div>

          {lastUpdated && (
            <p style={{ textAlign: "center", color: "#555", marginTop: "1rem" }}>
              Last Updated: {lastUpdated}
            </p>
          )}
        </div>

        {/* === DASHBOARD GRID === */}
        <div className="dashboard-grid">
          {services.map((svc, idx) => (
            <div
              key={idx}
              className={`service-card ${svc.status.toLowerCase()}`}
              onClick={() => {
                setSelectedService(svc);
                setActiveTab("overview");
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="service-name">
                <span>{svc.name}</span>
                <span className="status">{svc.status}</span>
              </div>
              <p>{svc.description}</p>
              <div className="backend">
                <strong>Region:</strong> {svc.region}
                <br />
                <strong>Metrics:</strong>{" "}
                {svc.metrics && svc.metrics.join(", ")}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === POP-OUT MODAL WITH TABS === */}
      {selectedService && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedService(null)}
            >
              &times;
            </button>

            <h2>{selectedService.name}</h2>
            <p
              className={`status ${selectedService.status.toLowerCase()}`}
              style={{ fontWeight: "bold", marginBottom: "1rem" }}
            >
              {selectedService.status}
            </p>

            {/* Tab Navigation */}
            <div className="tab-nav">
              {["overview", "metrics", "backend"].map((tab) => (
                <button
                  key={tab}
                  className={`tab-button ${
                    activeTab === tab ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "overview"
                    ? "Overview"
                    : tab === "metrics"
                    ? "Metrics"
                    : "Backend Logs"}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === "overview" && (
                <>
                  <p>{selectedService.description}</p>
                  <p>
                    <strong>Region:</strong> {selectedService.region}
                  </p>
                  <p>
                    <strong>Last Checked:</strong>{" "}
                    {new Date(
                      selectedService.lastChecked
                    ).toLocaleTimeString()}
                  </p>
                </>
              )}

              {activeTab === "metrics" && (
                <>
                  <strong>Monitored Metrics:</strong>
                  <ul>
                    {selectedService.metrics?.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </>
              )}

              {activeTab === "backend" && (
                <>
                  <strong>Service Insights:</strong>
                  <p>{selectedService.backend}</p>
                  <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
                    Simulated Lambda function (boto3) calls this service to
                    gather performance metrics and alarm states. This mirrors
                    how AWS CloudWatch and Health APIs monitor regional service
                    health.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* === README PREVIEW === */}
      <section className="readme-preview-section">
        <h3>CloudHealthDashboard README Preview</h3>
        <div className={`readme-preview-box markdown-body ${isReadmeExpanded ? 'expanded' : 'collapsed'}`}>
          {readmeLoading && <p style={{margin:0}}>Loading README...</p>}
          {readmeError && <p style={{color:'#d73a49', margin:0}}>Failed to load README: {readmeError}</p>}
          {!readmeLoading && !readmeError && readmeMarkdown && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[
                rehypeSlug,
                [rehypeAutolinkHeadings, {
                  behavior: 'append',
                  properties: {
                    className: ['heading-anchor-link']
                  },
                  content: (node) => ([
                    {
                      type: 'element',
                      tagName: 'span',
                      properties: { className: ['sr-only'] },
                      children: [
                        { type: 'text', value: `Permalink to ${getNodeText(node)}`.trim() }
                      ]
                    },
                    {
                      type: 'element',
                      tagName: 'span',
                      properties: { className: ['heading-anchor'], 'aria-hidden': 'true' },
                      children: [{ type: 'text', value: '#' }]
                    }
                  ])
                }],
                rehypeHighlight
              ]}
              components={{
                a: ({node, children, ...props}) => (
                  <a {...props} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                img: ({node, ...props}) => (
                  <img style={{ maxWidth: '100%', height: 'auto' }} {...props} alt={props.alt || ''} />
                ),
                code: ({inline, className, children, ...props}) => (
                  <code
                    className={className}
                    style={{
                      background: inline ? '#f6f8fa' : '#f6f8fa',
                      padding: inline ? '2px 4px' : '12px 16px',
                      display: inline ? 'inline' : 'block',
                      borderRadius: 6,
                      fontSize: '0.85rem',
                      border: '1px solid #d0d7de',
                      color: '#24292f'
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                )
              }}
            >
              {readmeMarkdown}
            </ReactMarkdown>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          {!readmeLoading && !readmeError && readmeMarkdown && (
            <button
              type="button"
              className="readme-toggle"
              onClick={() => setIsReadmeExpanded(prev => !prev)}
            >
              {isReadmeExpanded ? 'Collapse README' : 'Expand Full README'}
            </button>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <a
            href="https://github.com/dregraham/resume/blob/main/src/pages/CloudHealthDashboard/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="readme-preview-link"
          >
            README on GitHub ↗
          </a>
        </div>
      </section>
    </>
  );
}
