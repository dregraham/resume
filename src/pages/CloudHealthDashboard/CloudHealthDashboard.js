import React, { useState } from "react";
import "./CloudDashboard.css";
import SimpleNav from "../../Components/SimpleNav";
import coreData from "./mockData1_core.json";
import computeNetworkData from "./mockData2_compute_network.json";
import securityData from "./mockData3_security_identity.json";
import databaseData from "./mockData4_database_analytics.json";
import devopsData from "./mockData5_devops_global.json";


export default function CloudHealthDashboard() {
  const [selectedDataset, setSelectedDataset] = useState("core");
  const [services, setServices] = useState(coreData);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isBlurbExpanded, setIsBlurbExpanded] = useState(false);

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

      {/* === HERO SECTION === */}
      <section className="text-center py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'desyrelregular, serif' }}>
            Cloud Health Dashboard
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-8">
            AWS Service Health Console simulation with interactive service monitoring, real-time status updates, and detailed metrics visualization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://github.com/dregraham/resume/tree/main/src/pages/CloudHealthDashboard" target="_blank" rel="noopener noreferrer" 
               className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium">
              View Source Code
            </a>
            <button onClick={() => document.querySelector('.dashboard-container').scrollIntoView({behavior: 'smooth'})} 
                    className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-50 transition-colors font-medium">
              Try Dashboard
            </button>
          </div>
        </div>
      </section>

      <section id="top" className="dashboard-container">
      </section>

      {/* === HOW IT WORKS === */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-12" style={{ fontFamily: 'desyrelregular, serif' }}>How It Works</h2>
          <div className="grid gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold flex items-center justify-center text-xl shadow-md flex-shrink-0">
                  01
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Health Simulation</h3>
                  <p className="text-gray-600 leading-relaxed">Interactive dashboard displaying AWS service status across multiple categories. Each service card shows real-time health indicators, regional information, and key performance metrics.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white font-bold flex items-center justify-center text-xl shadow-md flex-shrink-0">
                  02
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Interactive Service Details</h3>
                  <p className="text-gray-600 leading-relaxed">Click any service card to open a detailed modal with tabbed navigation. View service overview, monitored metrics, and simulated backend logs that demonstrate AWS CloudWatch integration patterns.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-white font-bold flex items-center justify-center text-xl shadow-md flex-shrink-0">
                  03
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Dynamic Dataset Management</h3>
                  <p className="text-gray-600 leading-relaxed">Switch between different AWS service categories and trigger health checks to see real-time status updates. Demonstrates React state management and data visualization techniques.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === INTERACTIVE DASHBOARD === */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-12" style={{ fontFamily: 'desyrelregular, serif' }}>Interactive Dashboard</h2>
          
          <div className="bg-gray-50 p-6 rounded-xl mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <label htmlFor="dataset-select" className="font-semibold text-gray-700">Dataset:</label>
                <select
                  id="dataset-select"
                  value={selectedDataset}
                  onChange={handleDatasetChange}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="core">Core Services</option>
                  <option value="compute_network">Compute & Network</option>
                  <option value="security_identity">Security & Identity</option>
                  <option value="database_analytics">Database & Analytics</option>
                  <option value="devops_global">DevOps & Global</option>
                </select>
              </div>
              
              <button
                onClick={refreshStatus}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
              >
                {loading ? "Checking..." : "Run Health Check"}
              </button>
            </div>
            
            {lastUpdated && (
              <p className="text-center text-gray-600 text-sm">
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

      {/* === HOW I BUILT THIS BLURB === */}
      <div className={`how-built-blurb ${isBlurbExpanded ? 'expanded' : ''}`} onClick={() => setIsBlurbExpanded(!isBlurbExpanded)}>
        <h3>The Build Story {isBlurbExpanded ? '−' : '+'}</h3>
        {isBlurbExpanded && (
          <div className="blurb-story">
            <p><strong>Initial Challenge:</strong> Create a realistic AWS Service Health Console simulation that feels authentic without access to real AWS Health APIs.</p>
            
            <p><strong>JSX Syntax Nightmare:</strong> Spent considerable time debugging unclosed ReactMarkdown components and missing closing tags that were causing compilation failures. The error messages weren't always clear about which components were malformed.</p>
            
            <p><strong>Data Structure Complexity:</strong> Organizing mock data across 5 different AWS service categories (Core, Compute, Security, Database, DevOps) while maintaining realistic service names, regions, and metrics was more complex than expected.</p>
            
            <p><strong>Modal System Issues:</strong> Building the tabbed modal system with click-outside detection proved tricky. Had to handle event propagation properly to prevent the modal from closing when clicking inside tabs or content areas.</p>
            
            <p><strong>State Management Challenges:</strong> Managing multiple useState hooks for dataset selection, service details, modal state, and loading states while keeping everything synchronized required careful planning of component re-renders.</p>
            
            <p><strong>Final Solution:</strong> JSON mock datasets organized by service category → React functional components with useState hooks → Interactive modal system with tabbed navigation → AWS-style CSS mimicking the real console. Result: Authentic-feeling dashboard that demonstrates React skills and AWS knowledge.</p>
          </div>
        )}
      </div>

      {/* === README LINK === */}
      <section style={{ padding: '4rem 0', backgroundColor: 'white', textAlign: 'center' }}>
        <a
          href="https://github.com/dregraham/resume/blob/main/src/pages/CloudHealthDashboard/README.md"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          style={{ textDecoration: 'none' }}
        >
          README.md →
        </a>
      </section>
    </>
  );
}
