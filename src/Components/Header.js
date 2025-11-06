import React, { Component } from "react";
import ParticlesBg from "particles-bg";

class Header extends Component {
  render() {
    if (!this.props.data) return null;
    const github = this.props.data.github;
    const name = this.props.data.name;
    const description = this.props.data.description;
  
    return (
      <header id="home"
      style={{ 
    backgroundSize: "contain",
     backgroundPosition: "center",
     backgroundRepeat: "no-repeat",
     minHeight: "100vh",
     position: "relative"
      }}>

     {<ParticlesBg type="lines" color="#ffffff" bg={true} />}
      <nav id="nav-wrap">
        <a className="mobile-btn" href="#nav-wrap" title="Show navigation">
        Show navigation
        </a>
        <a className="mobile-btn" href="#home" title="Hide navigation">
        Hide navigation
        </a>
        <ul id="nav" className="nav">
        <li>
          <a className="smoothscroll" href="#home">
          Home
          </a>
        </li>
        <li>
          <a className="smoothscroll" href="#about">
          About
          </a>
        </li>
        <li>
          <a className="smoothscroll" href="#resume">
          Resume
          </a>
        </li>
        <li>
          <a className="smoothscroll" href="#projects">
          Projects
          </a>
        </li>
        <li>
          <a className="smoothscroll" href="#contact">
          Contact
          </a>
        </li>
        </ul>
      </nav>
      <div className="row banner">
                <div className="banner-text">
                        <h1 className="responsive-headline">
                                  {name}</h1>
                                          <h3>{description}</h3>
                                                  <hr />
                                                          <ul className="social">
                                                            <a href={github} className="button btn github-btn" target="_blank" rel="noopener noreferrer">
                                                              <i className="fa fa-github"></i>Github
                                                            </a>
                                                            <a href="https://www.linkedin.com/in/dregraham/" className="button btn github-btn" target="_blank" rel="noopener noreferrer" style={{marginLeft: "1rem"}}>
                                                              <i className="fa fa-linkedin" style={{ color: "#0A66C2" }}></i> LinkedIn
                                                            </a>
                                                          </ul>
                                                                                                        </div>
                                                                                                              </div>
      <p className="scrolldown">
        <a className="smoothscroll" href="#about">
        <i className="icon-down-circle"></i>
        </a>
      </p>
      </header>
    );
  }
}

export default Header;