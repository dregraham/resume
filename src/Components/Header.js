import React, { Component } from "react";
import ParticlesBg from "particles-bg";

class Header extends Component {
  render() {
    if (!this.props.data) return null;
    const github = this.props.data.github;
    const name = this.props.data.name;
    const description = this.props.data.description;
    // Particle configuration for a cloud-like effect
    let config = {
      num: [2, 4],
      rps: 0.2,
      radius: [10, 30],
      life: [10, 20],
      v: [0.2, 0.5],
      tha: [90, 90], 
      alpha: [0.6, 0],
      scale: [1, 0.1],
      position: "all", 
      color: "random",
      cross: "dead",
      random: 15,
      g: -0.1, // slight negative gravity to help float up
      onParticleUpdate: (ctx, particle) => {
        ctx.globalCompositeOperation = 'source-over';
        ctx.beginPath();
    
        const x = particle.p.x;
        const y = particle.p.y;
        const size = particle.radius * 2.5;
    
        // Start at far left
        ctx.moveTo(x - size * 2, y);
    
        // Top Left Puff
        ctx.bezierCurveTo(
          x - size * 2.2, y - size * 0.6,
          x - size * 1.4, y - size * 0.9,
          x - size, y - size * 0.6
        );
    
        // Top Middle-Left Puff
        ctx.bezierCurveTo(
          x - size * 1.1, y - size * 1.1,
          x - size * 0.3, y - size * 1.1,
          x - size * 0.2, y - size * 0.6
        );
    
        // Top Middle-Right Puff
        ctx.bezierCurveTo(
          x + size * 0.1, y - size * 1.3,
          x + size * 0.9, y - size * 1.3,
          x + size, y - size * 0.6
        );
    
        // Top Right Puff
        ctx.bezierCurveTo(
          x + size * 1.4, y - size * 0.9,
          x + size * 2.2, y - size * 0.6,
          x + size * 2, y
        );
    
        // Bottom Right Puff
        ctx.bezierCurveTo(
          x + size * 1.8, y + size * 0.5,
          x + size * 1.2, y + size * 0.7,
          x + size, y + size * 0.3
        );
    
        // Bottom Left Puff
        ctx.bezierCurveTo(
          x + size * 0.6, y + size * 0.7,
          x - size * 0.6, y + size * 0.7,
          x - size, y + size * 0.3
        );
    
        // Finish to far left (closing path)
        ctx.bezierCurveTo(
          x - size * 1.2, y + size * 0.7,
          x - size * 1.8, y + size * 0.5,
          x - size * 2, y
        );
    
        ctx.closePath();
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();
      }
    };    
    return (
      <header id="home"
      style={{ 
              //backgroundImage: "url('/images/background.jpg')",
    backgroundSize: "contain",
     backgroundPosition: "center",
     backgroundRepeat: "no-repeat",
     minHeight: "100vh",
     position: "relative"
      }}>

     {<ParticlesBg type="custom" config={config} bg={true} />}
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
                                                                    <a href={github} className="button btn github-btn">
                                                                              <i className="fa fa-github"></i>Github
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