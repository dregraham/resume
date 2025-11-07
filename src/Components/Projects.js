
import React, { Component } from "react";
import { Link } from 'react-router-dom';

let id = 0;
class projects extends Component {
  render() {
    if (!this.props.data) return null;

    const projects = this.props.data.projectdetails.map(function (project) {
      let projectImage = "images/projects/" + project.image;
      return (
        <div key={id++} className="columns projects-item">
          <div className="item-wrap">
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <Link to={project.url} style={{ fontWeight: 'bold', color: '#000000ff', textDecoration: 'none' }}>{project.title}</Link>
            </div>
            <Link to={project.url}>
              <img alt={project.title} src={projectImage} />
            </Link>
            <div style={{ textAlign: "center" }}>
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
