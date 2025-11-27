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
        name: "AWS",
        service: "EC2, Lambda, S3, DynamoDB, CloudWatch, IaC",
        details:
          "Strong hands-on AWS experience with compute, storage, monitoring, and IaC.",
        level: "85%",
      },
      {
        name: "Azure & GCP",
        service: "Functions, DevOps, CosmosDB, Cloud Run",
        details:
          "Cross-cloud understanding of Azure and GCP services for multi-cloud deployment.",
        level: "40%",
      },
      {
        name: "Programming & Scripting",
        service:
          "Python, PowerShell, JavaScript, React, Bash, HTML/CSS, JSON/YAML",
        level: "85%",
        details:
          "Versatile in automation, web, and scripting across multiple platforms.",
      },
      {
        name: "Infrastructure as Code & CI/CD",
        service: "Terraform, CloudFormation, GitHub Actions, Azure DevOps",
        level: "75%",
        details:
          "Proficient in IaC and deployment pipelines for scalable cloud environments.",
      },
      {
        name: "Monitoring & Observability",
        service: "CloudWatch, Sumo Logic, Kibana, EventBridge",
        level: "80%",
        details:
          "Experienced with log analysis, telemetry, and system health automation.",
      },
      {
        name: "Databases",
        service: "SQL Server, DynamoDB, Cosmos DB, RDS, Redis",
        level: "90%",
        details:
          "Comfortable querying and optimizing both relational and NoSQL databases.",
      },
      {
        name: "Cross-Platform Systems",
        service: "Linux, Windows, Networking, Security",
        level: "70%",
        details:
          "Solid understanding of system administration, networking, and OS-level automation.",
      },
    ];

    const skills = skillsData.map((skill) => {
      const backgroundColor = this.getRandomColor();
      const className = "bar-expand " + lower(skill.name);
      const width = skill.level;

      return (
        <li
          key={skill.name}
          className="skill-item"
          style={{
            flex: "1 1 48%",
            marginBottom: "40px",
            paddingBottom: "10px",
            minHeight: "90px",
          }}
        >
          <div className="skill-header">
            <span className="skill-name">{skill.name}</span>
          </div>
          {skill.service && (
            <span
              className="skill-service"
              style={{
                display: "block",
                fontSize: "0.95em",
                color: "#888",
                marginTop: "2px",
              }}
            >
              {skill.service}
            </span>
          )}
          <div
            className="skill-track"
            style={{
              height: "10px",
              background: "#eee",
              borderRadius: "5px",
              overflow: "hidden",
              marginTop: "16px",
            }}
          >
            <span
              style={{
                width,
                backgroundColor,
                display: "block",
                height: "100%",
                borderRadius: "5px",
              }}
              className={className}
            ></span>
          </div>
          {skill.details && (
            <span className="skill-details">{skill.details}</span>
          )}
        </li>
      );
    });

    const certs = [
      { file: "aws_cloud_practitioner.png", label: "AWS Cloud Practitioner", number: "AWSCP" },
      { file: "microsoft-certified-associate-badge.svg", label: "Microsoft Azure Associate", number: "AZ-104" },
      { file: "microsoft-certified-fundamentals-badge.svg", label: "Microsoft Certified Fundamentals", number: "AZ-900" },
      { file: "CCAP.png", label: "Certified Cloud Architecture Professional", number: "CCAP" },
      { file: "CIOS.png", label: "Certified Information Operations Specialist", number: "CIOS" },
      { file: "Cloud+.png", label: "CompTIA Cloud+" },
      { file: "CSCP.png", label: "Cybersecurity Cloud Practitioner", number: "CSCP" },
      { file: "CSIS.png", label: "Cybersecurity Information Specialist", number: "CSIS" },
      { file: "Net+.png", label: "CompTIA Network+" },
      { file: "Project+.png", label: "CompTIA Project+" },
      { file: "Sec+.png", label: "CompTIA Security+" },
      { file: "A+.png", label: "CompTIA A+" },
    ];

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
            <ul
              className="skills bars"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: "64px",
                rowGap: "18px",
                marginBottom: "10px",
                padding: 0,
                listStyle: "none",
              }}
            >
              {skills}
            </ul>
          </div>
        </div>

        <div className="row" style={{ marginBottom: '10px' }}>
          <div className="twelve columns">
            <hr />
          </div>
        </div>

        {/* Certifications */}
        <div className="row certifications">
          <div className="three columns header-col">
            <h1><span>Certifications</span></h1>
          </div>
          <div className="nine columns main-col">
            <div
              className="cert-scroll"
              style={{
                overflowX: "auto",
                overflowY: "hidden",
                whiteSpace: "nowrap",
                padding: "8px 0 18px 0",
                marginBottom: "8px",
                borderRadius: "8px",
                background: "#fafbfc",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "32px",
                  minHeight: "100px",
                  alignItems: "center",
                }}
              >
                {certs.map((cert) => (
                  <div key={cert.file} style={{ textAlign: "center", minWidth: "160px", maxWidth: "180px", width: "180px", flex: "0 0 auto" }}>
                    <button
                      onClick={() => this.setState({ openCert: cert })}
                      style={{
                        width: "100%",
                        padding: 0,
                        border: "none",
                        background: "transparent",
                        cursor: "zoom-in",
                      }}
                    >
                      <img
                        src={process.env.PUBLIC_URL + "/images/" + cert.file}
                        alt={cert.label}
                        style={{
                          width: "100%",
                          height: "90px",
                          objectFit: "contain",
                          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
                          transition: "transform .2s",
                        }}
                        loading="lazy"
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
                      />
                    </button>
                    <div className="cert-label" style={{
                      marginTop: "8px",
                      fontWeight: 600,
                      fontSize: "0.93em",
                      lineHeight: 1.15,
                      whiteSpace: "normal",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      wordBreak: "break-word",
                      width: "100%"
                    }}>{cert.label}</div>
                    {cert.number && (
                      <div className="cert-number" style={{ fontSize: "0.93em", color: "#444", marginTop: "2px" }}>{cert.number}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {this.state.openCert && (
          <div
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
              padding: "40px",
            }}
          >
            <div style={{ maxWidth: "600px", width: "100%", textAlign: "center", position: "relative" }}>
              <button
                onClick={() => this.setState({ openCert: null })}
                style={{
                  position: "absolute",
                  top: "-26px",
                  right: "-26px",
                  background: "#fff",
                  borderRadius: "50%",
                  width: "52px",
                  height: "52px",
                  fontSize: "30px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
              <img
                src={process.env.PUBLIC_URL + "/images/" + this.state.openCert.file}
                alt={this.state.openCert.label}
                style={{ maxWidth: "100%", maxHeight: "65vh", objectFit: "contain" }}
              />
            </div>
          </div>
        )}

      </section>
    );
  }
}

export default Resume;
