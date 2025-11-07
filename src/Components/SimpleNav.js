
// Styled nav for dashboard pages, matches main header nav
import React, { useState, useEffect } from "react";
const SECTIONS = ["home", "about", "resume", "projects", "contact"];

export default function SimpleNav() {
  const [active, setActive] = useState('home');
  const isHome = window.location.pathname === '/' || window.location.pathname === '/index.html';

  useEffect(() => {
    if (!isHome) return;
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      setActive(hash);
    };
    const onScroll = () => {
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
      if (active !== closest) {
        setActive(closest);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('scroll', onScroll);
    onHashChange();
    onScroll();
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('scroll', onScroll);
    };
    // eslint-disable-next-line
  }, [isHome]);

  const handleNavClick = (e, section) => {
    if (!isHome) {
      e.preventDefault();
      window.location.assign(`/#${section}`); // Force full reload
      return;
    }
    e.preventDefault();
    window.location.hash = `#${section}`;
    setActive(section);
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav id="nav-wrap" className="opaque">
      <ul id="nav" className="nav">
        <li><a className={`smoothscroll${active === 'home' ? ' current' : ''}`} href="/#home" onClick={e => handleNavClick(e, 'home')}>Home</a></li>
        <li><a className={`smoothscroll${active === 'about' ? ' current' : ''}`} href="/#about" onClick={e => handleNavClick(e, 'about')}>About</a></li>
        <li><a className={`smoothscroll${active === 'resume' ? ' current' : ''}`} href="/#resume" onClick={e => handleNavClick(e, 'resume')}>Resume</a></li>
        <li><a className={`smoothscroll${active === 'projects' ? ' current' : ''}`} href="/#projects" onClick={e => handleNavClick(e, 'projects')}>Projects</a></li>
        <li><a className={`smoothscroll${active === 'contact' ? ' current' : ''}`} href="/#contact" onClick={e => handleNavClick(e, 'contact')}>Contact</a></li>
      </ul>
    </nav>
  );
}
