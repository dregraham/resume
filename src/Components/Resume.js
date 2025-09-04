import React, { Component } from "react";
import { asList, asStr, lower } from "../utils/safe"; // <-- add this import

class Resume extends Component {
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

    const work = asList(this.props.data.work).map((work) => (
      <div key={asStr(work?.company)}>
        <h3>{asStr(work?.company)}</h3>
        <p className="info">
          {asStr(work?.title)}
          <span>&bull;</span> <em className="date">{asStr(work?.years)}</em>
        </p>
        <p>{asStr(work?.description)}</p>
      </div>
    ));

    const skills = asList(this.props.data.skills).map((skills) => {
      const backgroundColor = this.getRandomColor();
      const className = "bar-expand " + lower(skills?.name);
      const width = asStr(skills?.level);

      return (
        <li key={asStr(skills?.name)}>
          <span style={{ width, backgroundColor }} className={className}></span>
          <em>{asStr(skills?.name)}</em>
        </li>
      );
    });

    return (
      <section id="resume">
        <div className="row education">
          <div className="three columns header-col">
            <h1>
              <span>Education</span>
            </h1>
          </div>

          <div className="nine columns main-col">
            <div className="row item">
              <div className="twelve columns">{education}</div>
            </div>
          </div>
        </div>

        <div className="row work">
          <div className="three columns header-col">
            <h1>
              <span>Work</span>
            </h1>
          </div>

          <div className="nine columns main-col">{work}</div>
        </div>

        <div className="row skill">
          <div className="three columns header-col">
            <h1>
              <span>Skills</span>
            </h1>
          </div>

          <div className="nine columns main-col">
            <p>{skillmessage}</p>

            <div className="bars">
              <ul className="skills">{skills}</ul>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Resume;
