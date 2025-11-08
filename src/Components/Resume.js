import React, { Component } from "react";
import { asList, asStr, lower } from "../utils/safe";

class Resume extends Component {
  constructor(props) {
    super(props);
    this.state = { openCert: null };
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(e) {
    if (e.key === "Escape" && this.state.openCert) {
      this.setState({ openCert: null });
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  getRandomColor() {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  render() {
    if (!this.props.data) return null;

    const skillmessage = asStr(this.props.data.skillmessage);

    const education = asList(this.props.data.education).map((education) => (
      <div key={asStr(education?.school)}>
        <h3>{asStr(education?.school)}</h3>
        <p className="info">
          {asStr(education?.degree)} <span>&bull;</span>
          <em className="date">{asStr(education?.graduated)}</em>
        </p>
        <p>{asStr(education?.description)}</p>
      </div>
    ));

    // Work experience mapping (restored after accidental removal)
    const work = asList(this.props.data.work).map((item) => (
      <div key={asStr(item?.company)}>
        <h3>{asStr(item?.company)}</h3>
        <p className="info">
          {asStr(item?.title)} <span>&bull;</span>
          <em className="date">{asStr(item?.years)}</em>
        </p>
        <p>{asStr(item?.description)}</p>
      </div>
    ));

    const skillsData = [
      {
        name: "AWS (EC2, Lambda, S3, DynamoDB, CloudWatch, IaC)",
        level: "85%",
        tooltip: "Strong hands-on AWS experience with compute, storage, monitoring, and IaC."
      },
      {
        name: "Azure & GCP (Functions, DevOps, CosmosDB, Cloud Run)",
        level: "40%",
        tooltip: "Cross-cloud understanding of Azure and GCP services for multi-cloud deployment."
      },
      {
        name: "Programming & Scripting (Python, PowerShell, JavaScript, React, Bash, HTML/CSS, JSON/YAML)",
        level: "85%",
        tooltip: "Versatile in automation, web, and scripting across multiple platforms."
      },
      {
        name: "Infrastructure as Code & CI/CD (Terraform, CloudFormation, GitHub Actions, Azure DevOps)",
        level: "75%",
        tooltip: "Proficient in IaC and deployment pipelines for scalable cloud environments."
      },
      {
        name: "Monitoring & Observability (CloudWatch, Sumo Logic, Kibana)",
        level: "80%",
        tooltip: "Experienced with log analysis, telemetry, and system health automation."
      },
      {
        name: "Databases (SQL Server, DynamoDB, Cosmos DB, RDS, Redis)",
        level: "90%",
        tooltip: "Comfortable querying and optimizing both relational and NoSQL databases."
      },
      {
        name: "Cross-Platform Systems (Linux, Windows, Networking, Security)",
        level: "70%",
        tooltip: "Solid understanding of system administration, networking, and OS-level automation."
      }
    ];

    const skills = skillsData.map((skill) => {
      const backgroundColor = this.getRandomColor();
      const className = "bar-expand " + lower(skill.name);
      const width = skill.level;

      return (
        <li
          key={skill.name}
          className="skill-item"
          title={skill.tooltip}
          style={{ flex: "1 1 48%", marginBottom: "20px" }}
        >
          <div className="skill-header">
            <span className="skill-name">{skill.name}</span>
          </div>
          <div
            className="skill-track"
            role="progressbar"
            aria-valuenow={parseInt(width, 10)}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={skill.name + " proficiency"}
            style={{
              height: "10px",
              background: "#eee",
              borderRadius: "5px",
              overflow: "hidden",
              marginTop: "6px"
            }}
          >
            <span
              style={{
                width,
                backgroundColor,
                display: "block",
                height: "100%",
                borderRadius: "5px"
              }}
              className={className}
            ></span>
          </div>
        </li>
      );
    });

    // --- Certifications ---
    const certs = [
      { file: "A+.png", label: "CompTIA A+" },
      { file: "aws_cloud_practitioner.png", label: "AWS Cloud Practitioner" },
      { file: "CCAP.png", label: "Certified Cloud Architecture Professional" },
      { file: "CIOS.png", label: "Certified Information Operations Specialist" },
      { file: "Cloud+.png", label: "CompTIA Cloud+" },
      { file: "CSCP.png", label: "Cybersecurity Cloud Practitioner" },
      { file: "CSIS.png", label: "Cybersecurity Information Specialist" },
      { file: "microsoft-certified-associate-badge.svg", label: "Microsoft Certified Associate" },
      { file: "microsoft-certified-fundamentals-badge.svg", label: "Microsoft Certified Fundamentals" },
      { file: "Net+.png", label: "CompTIA Network+" },
      { file: "Project+.png", label: "CompTIA Project+" },
      { file: "Sec+.png", label: "CompTIA Security+" }
    ].sort((a, b) => a.label.localeCompare(b.label));

    return (
      <section id="resume">
        {/* Education */}
        <div className="row education">
          <div className="three columns header-col">
            <h1><span>Education</span></h1>
          </div>
          <div className="nine columns main-col">
            <div className="row item">
              <div className="twelve columns">{education}</div>
            </div>
          </div>
        </div>

        {/* Work */}
        <div className="row work">
          <div className="three columns header-col">
            <h1><span>Work</span></h1>
          </div>
          <div className="nine columns main-col">{work}</div>
        </div>

        {/* Skills */}
        <div className="row skill">
          <div className="three columns header-col">
            <h1><span>Skills</span></h1>
          </div>
          <div className="nine columns main-col">
            <p>{skillmessage}</p>

            {/* Two-Column Responsive Layout */}
            <ul
              className="skills"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                marginBottom: "30px",
                padding: 0,
                listStyle: "none"
              }}
            >
              {skills}
            </ul>

            {/* Certification Grid */}
            <div
              className="cert-grid"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "28px",
                width: "100%",
                padding: "0 10px"
              }}
            >
              {certs.map((cert) => (
                <div key={cert.file} style={{ textAlign: "center", flex: "0 1 110px" }}>
                  <button
                    onClick={() => this.setState({ openCert: cert })}
                    style={{
                      width: "100%",
                      padding: 0,
                      border: "none",
                      background: "transparent",
                      cursor: "zoom-in"
                    }}
                    aria-label={`View ${cert.label} badge full size`}
                  >
                    <img
                      src={process.env.PUBLIC_URL + "/images/" + cert.file}
                      alt={cert.label}
                      title={cert.label}
                      style={{
                        width: "100%",
                        height: "80px",
                        objectFit: "contain",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
                        transition: "transform .2s"
                      }}
                      loading="lazy"
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
                    />
                  </button>
                  <div className="cert-label" style={{ marginTop: "8px" }}>{cert.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certification Modal */}
        {this.state.openCert && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={this.state.openCert.label + " enlarged badge"}
            onClick={(e) => {
              if (e.target === e.currentTarget) this.setState({ openCert: null });
            }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "40px"
            }}
          >
            <div
              style={{
                maxWidth: "600px",
                width: "100%",
                textAlign: "center",
                position: "relative"
              }}
            >
              <button
                onClick={() => this.setState({ openCert: null })}
                style={{
                  position: "absolute",
                  top: "-26px",
                  right: "-26px",
                  color: "#111",
                  background: "#fff",
                  border: "none",
                  fontSize: "30px",
                  lineHeight: "30px",
                  cursor: "pointer",
                  borderRadius: "50%",
                  width: "52px",
                  height: "52px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.45)",
                  transition: "transform .15s ease, box-shadow .15s ease"
                }}
                aria-label="Close enlarged badge"
                onMouseEnter={e => { e.currentTarget.style.transform='scale(1.08)'; e.currentTarget.style.boxShadow='0 6px 16px rgba(0,0,0,0.55)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='scale(1.0)'; e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.45)'; }}
              >
                ×
              </button>
              <img
                src={process.env.PUBLIC_URL + "/images/" + this.state.openCert.file}
                alt={this.state.openCert.label}
                style={{
                  maxWidth: "100%",
                  maxHeight: "65vh",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto"
                }}
              />
              <div
                style={{
                  color: "#000000ff",
                  marginTop: "16px",
                  fontSize: "1rem",
                  letterSpacing: "0.5px"
                }}
              >
                {this.state.openCert.label}
              </div>
              <div style={{ marginTop: "8px" }}>
                <button
                  onClick={() => this.setState({ openCert: null })}
                  style={{
                    background: "#ffffff22",
                    backdropFilter: "blur(4px)",
                    border: "1px solid #ffffff55",
                    padding: "10px 18px",
                    borderRadius: "6px",
                    color: "#ffffffff",
                    cursor: "pointer"
                  }}
                >
                  Close (Esc)
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }
}

export default Resume;
