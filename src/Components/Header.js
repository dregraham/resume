
import React, { Component } from "react";
import ParticlesBg from "particles-bg";
// Section IDs in order
const SECTIONS = ["home", "about", "resume", "projects", "contact"];


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { activeSection: "home" };
    this.handleNavClick = this.handleNavClick.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener("hashchange", this.handleHashChange, false);
    window.addEventListener("scroll", this.onScroll, false);
    this.onScroll();
    // Scroll to hash on initial mount if present
    setTimeout(() => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          this.setState({ activeSection: hash });
        }
      }
    }, 100);
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.handleHashChange, false);
    window.removeEventListener("scroll", this.onScroll, false);
  }

  handleHashChange = () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    this.setState({ activeSection: hash });
    // Scroll to section if hash changes
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  handleNavClick(e, section) {
    e.preventDefault();
    window.location.hash = `#${section}`;
    this.setState({ activeSection: section });
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onScroll() {
    // Find the section closest to the top
    let closest = 'home';
    let minDist = Number.POSITIVE_INFINITY;
    SECTIONS.forEach(section => {
      const el = document.getElementById(section);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < minDist) {
          minDist = rect.top;
          closest = section;
        }
      }
    });
    if (this.state.activeSection !== closest) {
      this.setState({ activeSection: closest });
    }
  }

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
              <a className={`smoothscroll${this.state.activeSection === 'home' ? ' current' : ''}`} href="#home" onClick={e => this.handleNavClick(e, 'home')}>Home</a>
            </li>
            <li>
              <a className={`smoothscroll${this.state.activeSection === 'about' ? ' current' : ''}`} href="#about" onClick={e => this.handleNavClick(e, 'about')}>About</a>
            </li>
            <li>
              <a className={`smoothscroll${this.state.activeSection === 'resume' ? ' current' : ''}`} href="#resume" onClick={e => this.handleNavClick(e, 'resume')}>Resume</a>
            </li>
            <li>
              <a className={`smoothscroll${this.state.activeSection === 'projects' ? ' current' : ''}`} href="#projects" onClick={e => this.handleNavClick(e, 'projects')}>Projects</a>
            </li>
            <li>
              <a className={`smoothscroll${this.state.activeSection === 'contact' ? ' current' : ''}`} href="#contact" onClick={e => this.handleNavClick(e, 'contact')}>Contact</a>
            </li>
          </ul>
        </nav>
        <div className="row banner">
          <div className="banner-text">
            <h1 className="responsive-headline">{name}</h1>
            <h3>{description}</h3>
            <hr />
            <ul className="social">
              <a href={github} className="button btn github-btn" target="_blank" rel="noopener noreferrer">
                <i className="fa fa-github"></i>Github
              </a>
              <a href="https://www.linkedin.com/in/dregraham/" className="button btn github-btn" target="_blank" rel="noopener noreferrer" style={{ marginLeft: "1rem" }}>
                <i className="fa fa-linkedin" style={{ color: "#0A66C2" }}></i> LinkedIn
              </a>
            </ul>
          </div>
        </div>
        <p className="scrolldown">
          <a className="smoothscroll" href="#about" onClick={e => this.handleNavClick(e, 'about')}>
            <i className="icon-down-circle"></i>
          </a>
        </p>
      </header>
    );
  }
}

export default Header;