import React, { Component } from "react";
import { Link } from "react-router-dom";

class Projects extends Component {
  render() {
    if (!this.props.data) return null;

    const projects = this.props.data.projectdetails.map((project) => {
      const projectImage = "images/projects/" + project.image;
      const isExternal = /^(http|https):\/\//i.test(project.url);
      const titleLink = isExternal ? (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontWeight: "bold",
            color: "#000000ff",
            textDecoration: "none",
            fontSize: "1.1em",
            display: "block",
            marginBottom: 8,
          }}
        >
          {project.title}
        </a>
      ) : (
        <Link
          to={project.url}
          style={{
            fontWeight: "bold",
            color: "#000000ff",
            textDecoration: "none",
            fontSize: "1.1em",
            display: "block",
            marginBottom: 8,
          }}
        >
          {project.title}
        </Link>
      );
      const imageLink = isExternal ? (
        <a href={project.url} target="_blank" rel="noopener noreferrer">
          <img
            src={projectImage}
            alt={project.title}
            style={{
              height: "180px",
              width: "auto",
              maxWidth: "100%",
              objectFit: "contain",
              display: "block",
              margin: "0 auto 10px auto",
              background: "#fff"
            }}
          />
        </a>
      ) : (
        <Link to={project.url}>
          <img
            src={projectImage}
            alt={project.title}
            style={{
              height: "180px",
              width: "auto",
              maxWidth: "100%",
              objectFit: "contain",
              display: "block",
              margin: "0 auto 10px auto",
              background: "#fff"
            }}
          />
        </Link>
      );
      return (
        <div
          key={project.title}
          className="projects-item"
          style={{
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          <div className="item-wrap">
            {titleLink}
            {imageLink}
            <div style={{ fontSize: "0.95em", color: "#888", marginTop: 5 }}>{project.category}</div>
          </div>
        </div>
      );
    });

    return (
      <section id="projects" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '60vh',
      }}>
        <style>{`
          #projects-header {
            text-align: center;
            margin-bottom: 20px;
          }
          #projects-wrapper {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 32px 32px;
            width: 100%;
            margin: 0 auto;
            max-width: 1200px;
          }
          .projects-underline {
            display: inline-block;
          }
          @media (max-width: 700px) {
            #projects-wrapper {
              grid-template-columns: 1fr;
              gap: 18px;
            }
          }
        `}</style>
        {/* Removed top divider as requested */}
        <div id="projects-header">
          <h1 style={{ marginBottom: 10 }}>
            <span className="projects-underline">Projects</span>
          </h1>
        </div>
        <div id="projects-wrapper">
          {projects}
        </div>
        <div style={{ width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', marginTop: '24px', marginBottom: '0' }}>
          <hr style={{ border: 0, borderTop: '2px solid #111', width: '100%', margin: 0 }} />
        </div>
      </section>
    );
  }
}

export default Projects;