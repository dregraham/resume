
import React, { Component } from "react";
import { Link } from "react-router-dom";

let id = 0;

class Projects extends Component {
  render() {
    if (!this.props.data) return null;

    const projects = this.props.data.projectdetails.map((project) => {
      const projectImage = "images/projects/" + project.image;
      const isExternal = /^(http|https):\/\//i.test(project.url);
      // Title link
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
      // Image link
      const imageLink = isExternal ? (
        <a href={project.url} target="_blank" rel="noopener noreferrer">
          <img
            src={projectImage}
            alt={project.title}
            style={{
              height: "240px",
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
              height: "240px",
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
          key={id++}
          className="projects-item"
          style={{
            flex: "1 1 260px",
            maxWidth: "260px",
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          <div className="item-wrap">
            {titleLink}
            {imageLink}
            <div style={{ fontSize: "0.9em", color: "#888" }}>
              {project.category}
            </div>
          </div>
        </div>
      );
    });

    return (
      <section id="projects">
        <div className="row projects">
          <div className="three columns header-col" style={{ textAlign: 'right' }}>
            <h1 style={{ marginBottom: 0 }}>
              <span style={{ borderBottom: '4px solid #23395d', paddingBottom: 4 }}>Projects</span>
            </h1>
          </div>
          <div className="nine columns main-col">
            <div
              id="projects-wrapper"
              style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '20px' }}
            >
              {projects}
            </div>
          </div>
        </div>
        {/* Full-width divider below Projects, above Education */}
        <div style={{ width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', marginTop: '0', marginBottom: '24px' }}>
          <hr style={{ border: 0, borderTop: '2px solid #111', width: '100%', margin: 0 }} />
        </div>
      </section>
    );
  }
}

export default Projects;
