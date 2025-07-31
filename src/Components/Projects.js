import React, { Component } from "react";
import Zmage from "react-zmage";

let id = 0;
class projects extends Component {
  render() {
    if (!this.props.data) return null;

    const projects = this.props.data.projectdetails.map(function (project) {
      let projectImage = "images/projects/" + project.image;
      return (
        <div key={id++} className="columns projects-item">
          <div className="item-wrap">
        <a href={project.url} target="_blank" rel="noopener noreferrer">
          <img alt={project.title} src={projectImage} />
        </a>
        <div style={{ textAlign: "center" }}>
          {project.title}
          <div style={{ fontSize: "0.9em", color: "#888" }}>{project.category}</div>
        </div>
          </div>
        </div>
      );
    });

    return (
      <section id="projects">
        <div className="row">
          <div className="twelve columns collapsed">
            <h1>Check Out Some of My Projects</h1>

            <div
              id="projects-wrapper"
              className="bgrid-thirds s-bgrid-thirds cf"
            >
              {projects}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default projects;
