
import React, { Component } from "react";
import ParticlesBg from "particles-bg";
const SECTIONS = ["home", "about", "projects", "resume", "contact"];


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { activeSection: "home", suppressUntil: 0 };
    this.handleNavClick = this.handleNavClick.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.scrollToSection = this.scrollToSection.bind(this);
  }

  componentDidMount() {
    window.addEventListener("hashchange", this.handleHashChange, false);
    window.addEventListener("scroll", this.onScroll, false);
    this.onScroll();
    // Scroll to hash on initial mount if present
    setTimeout(() => {
      let raw = window.location.hash;
      let section = raw.replace(/^#\/?/, '') || 'home';
      if (section.startsWith('file:')) section = section.replace(/^file:/, '');
      if (section && document.getElementById(section)) {
        this.setState({ activeSection: section, suppressUntil: Date.now() + 800 });
        // Use smooth scroll even on initial hash load for consistency
        this.scrollToSection(section, false);
      }
    }, 120);
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.handleHashChange, false);
    window.removeEventListener("scroll", this.onScroll, false);
  }

  handleHashChange = () => {
    const raw = window.location.hash;
    let section = raw.replace(/^#\/?/, '').split('/')[0] || 'home';
    if (section.startsWith('file:')) section = section.replace(/^file:/, '');
    if (!document.getElementById(section)) return; // ignore invalid hashes
    this.setState({ activeSection: section, suppressUntil: Date.now() + 800 });
    this.scrollToSection(section);
  };

  handleNavClick(e, section) {
    e.preventDefault();
    if (!document.getElementById(section)) return;
    window.location.hash = `#${section}`;
    this.setState({ activeSection: section, suppressUntil: Date.now() + 800 });
    this.scrollToSection(section);
  }

  scrollToSection(section, immediate = false) {
    const el = document.getElementById(section);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 65;
    window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' });
  }

  onScroll() {
    if (Date.now() < this.state.suppressUntil) return; // suppress shortly after programmatic scroll
    const offset = 65;
    let bestSection = this.state.activeSection;
    let bestDistance = Number.POSITIVE_INFINITY;
    SECTIONS.forEach(section => {
      const el = document.getElementById(section);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const distance = Math.abs(rect.top - offset);
      if (rect.bottom > offset + 20 && rect.top < window.innerHeight - 40 && distance < bestDistance) {
        bestDistance = distance;
        bestSection = section;
      }
    });
    if (window.location.hash.startsWith('#/projects') || window.location.hash === '#projects') {
      bestSection = 'projects';
    }
    if (bestSection !== this.state.activeSection) {
      this.setState({ activeSection: bestSection });
    }
  }

  render() {
    if (!this.props.data) return null;
    const github = this.props.data.github;
    const name = this.props.data.name;
    const description = this.props.data.description;
    const tagline = this.props.data.tagline;

    return (
      <header id="home"
        style={{
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          position: "relative"
        }}>

        {<ParticlesBg type="lines" bg={true}/>}

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
              <a className={`smoothscroll${this.state.activeSection === 'projects' ? ' current' : ''}`} href="#projects" onClick={e => this.handleNavClick(e, 'projects')}>Projects</a>
            </li>
            <li>
              <a className={`smoothscroll${this.state.activeSection === 'resume' ? ' current' : ''}`} href="#resume" onClick={e => this.handleNavClick(e, 'resume')}>Resume</a>
            </li>
            <li>
              <a className={`smoothscroll${this.state.activeSection === 'contact' ? ' current' : ''}`} href="#contact" onClick={e => this.handleNavClick(e, 'contact')}>Contact</a>
            </li>
          </ul>
        </nav>
        <div className="row banner">
          <div className="banner-text">
            <h1 className="responsive-headline">{name}</h1>
            <h4>{description}</h4>
            {tagline && (
              <div className="tagline">{tagline}</div>
            )}
            <hr />
            <ul className="social" style={{ listStyle: 'none', display: 'flex', justifyContent: 'center', gap: '24px', padding: 0 }}>
              <li>
                <a
                  href={github}
                  className="button btn github-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  title="View my GitHub repositories"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <i className="fa fa-github" aria-hidden="true" style={{ fontSize: '24px' }}></i>
                  <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.5px' }}>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/dregraham/"
                  className="button btn linkedin-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  title="Connect with me on LinkedIn"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <i className="fa fa-linkedin" aria-hidden="true" style={{ color: "#0A66C2", fontSize: '24px' }}></i>
                  <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.5px' }}>LinkedIn</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;