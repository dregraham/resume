import React, { useState } from "react";
import './CloudDashboard.css';
import SimpleNav from '../../Components/SimpleNav';

export default function CloudHealthDashboard() {
  // Service definitions with backend details
  const initialServices = [
    {
      name: "EC2",
      status: "Healthy",
      description: "Amazon EC2 provides scalable compute capacity in the cloud.",
      backend: "Lambda (Python/boto3): DescribeInstances, filter by status. Checks for running/stopped instances, scheduled events, and instance health metrics."
    },
    {
      name: "S3",
      status: "Healthy",
      description: "Amazon S3 stores and retrieves any amount of data.",
      backend: "Lambda (Python/boto3): ListBuckets, check bucket status. Monitors bucket accessibility, error rates, and storage metrics."
    },
    {
      name: "DynamoDB",
      status: "Degraded",
      description: "Amazon DynamoDB is a NoSQL database.",
      backend: "Lambda (Python/boto3): ListTables, scan for errors. Tracks table throughput, throttling, and error conditions."
    },
    {
      name: "Lambda",
      status: "Healthy",
      description: "AWS Lambda runs code without provisioning servers.",
      backend: "Lambda (Python/boto3): ListFunctions, check error rates. Monitors invocation errors, concurrency, and function health."
    },
    {
      name: "CloudWatch",
      status: "Down",
      description: "Amazon CloudWatch monitors resources and applications.",
      backend: "Lambda (Python/boto3): GetMetricData, check alarms. Evaluates alarm states, metric anomalies, and alerting."
    }
  ];

  const [services, setServices] = useState(initialServices);
  const [loading, setLoading] = useState(false);

  // Health check simulation
  const refreshStatus = () => {
    setLoading(true);
    setTimeout(() => {
      const updated = services.map((s) => ({
        ...s,
        status: ["Healthy", "Degraded", "Down"][Math.floor(Math.random() * 3)]
      }));
      setServices(updated);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <SimpleNav />
      <div style={{ height: 36 }} />
      <section id="top" className="dashboard-container" style={{ fontFamily: "'opensans-regular', sans-serif", color: '#313131', maxWidth: 1200, margin: '0 auto', padding: '32px 0', background: '#f9fafb', borderRadius: 0 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'flex-start' }}>
          {/* Left column: How This Works */}
          <div style={{ flex: '1 1 420px', minWidth: 340, maxWidth: 520, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
            <h2 style={{
              fontFamily: "'opensans-bold', sans-serif",
              fontSize: 30,
              lineHeight: '34px',
              margin: '0 0 14px 0',
              letterSpacing: '-1px',
              color: '#2563eb',
              textAlign: 'center'
            }}>How This Works</h2>
            <div style={{
              background: '#fff',
              boxShadow: '0 2px 12px rgba(37,99,235,0.07)',
              padding: '24px 24px 28px 24px',
              color: '#222',
              borderRadius: 0,
              textAlign: 'left',
              border: '1.5px solid #e5e7eb',
              fontFamily: "'opensans-regular', sans-serif",
              marginBottom: 24
            }}>
              <div style={{ color: '#2563eb', fontSize: 17, lineHeight: '26px', fontFamily: "'opensans-regular', sans-serif", marginBottom: 18, fontWeight: 500 }}>
                This dashboard simulates AWS service health checks using mock <code style={{ color: '#11ABB0', fontWeight: 700 }}>boto3</code> data.<br />
                <span style={{ color: '#11ABB0', fontWeight: 700 }}>Backend:</span> AWS Lambda (Python/boto3) queries service health and returns JSON.<br />
                <span style={{ color: '#11ABB0', fontWeight: 700 }}>Frontend:</span> React dashboard rotates service status using mock JSON files. Click <strong>Run Health Check</strong> to update statuses.
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={refreshStatus}
                  disabled={loading}
                  className="refresh-button"
                  style={{
                    background: 'linear-gradient(90deg, #2563eb 0%, #11ABB0 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 20,
                    border: 'none',
                    borderRadius: 6,
                    padding: '16px 32px',
                    boxShadow: '0 6px 24px rgba(37,99,235,0.18)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s, box-shadow 0.2s',
                    letterSpacing: '1px',
                    outline: 'none',
                    textTransform: 'uppercase',
                    borderBottom: '4px solid #11ABB0',
                    boxSizing: 'border-box',
                    filter: loading ? 'grayscale(0.5)' : 'none'
                  }}
                >
                  {loading ? 'Checking...' : 'Run Health Check'}
                </button>
              </div>
            </div>
          </div>
          {/* Right column: Button and service cards */}
          <div style={{ flex: '2 1 600px', minWidth: 340, width: '100%', background: 'transparent' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '28px',
              width: '100%',
              alignItems: 'stretch',
              justifyContent: 'center',
            }}>
              {services.map((svc, idx) => (
                <div
                  key={idx}
                  className={`service-card-modern ${svc.status.toLowerCase()}`}
                  style={{
                    background: '#fff',
                    border: '1.5px solid #e5e7eb',
                    borderTop: `5px solid ${svc.status === 'Healthy' ? '#11ABB0' : svc.status === 'Degraded' ? '#eab308' : '#ef4444'}`,
                    borderRadius: 10,
                    boxShadow: '0 2px 12px rgba(37,99,235,0.07)',
                    padding: '0 0 18px 0',
                    minHeight: 180,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'stretch',
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  <div style={{
                    background: 'transparent',
                    padding: '18px 18px 0 18px',
                    borderRadius: '10px 10px 0 0',
                    fontWeight: 700,
                    fontSize: 18,
                    color: '#2563eb',
                    marginBottom: 2,
                  }}>{svc.name}</div>
                  <div style={{
                    fontSize: 14,
                    color: '#444',
                    fontWeight: 500,
                    padding: '0 18px 0 18px',
                    marginBottom: 8,
                  }}>{svc.description}</div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '0 18px 0 18px',
                    marginBottom: 8,
                  }}>
                    <span style={{
                      fontWeight: 700,
                      color: svc.status === 'Healthy' ? '#11ABB0' : svc.status === 'Degraded' ? '#eab308' : '#ef4444',
                      fontSize: 15,
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                    }}>{svc.status}</span>
                  </div>
                  <div style={{
                    background: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    margin: '0 18px',
                    padding: '10px 12px',
                    fontSize: 13,
                    color: '#222',
                    fontWeight: 500,
                    minHeight: 48,
                  }}>
                    <span style={{ color: '#2563eb', fontWeight: 700 }}>Health Details:</span><br />
                    {svc.backend}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div id="bottom"></div>
      </section>
    </>
  );
}
										<i className="icon-up-circle"></i>
