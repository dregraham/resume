import React, { Component } from "react";
import ReactGA from "react-ga";
import $ from "jquery";
import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import About from "./Components/About";
import Resume from "./Components/Resume";
import Contact from "./Components/Contact";
import Projects from "./Components/Projects";
import ErrorBoundary from "./Components/ErrorBoundary";

// Use HashRouter for GitHub Pages to avoid server 404/CORS issues on deep links
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import CloudHealthDashboard from './pages/CloudHealthDashboard/CloudHealthDashboard';
import LogAnalyzerToolkit from './pages/LogAnalyzerToolkit/LogAnalyzerToolkit';
import DynamoDBInventoryManager from './pages/DynamoDBInventoryManager/DynamoDBInventoryManager';
import MultiCloudIAC from './pages/multicloud-iac/MultiCloudIAC';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foo: "bar",
      resumeData: {},
      lastHash: window.location.hash
    };

    ReactGA.initialize("UA-110570651-1");
    ReactGA.pageview(window.location.pathname);
  }

  getResumeData() {
    const rootUrl = process.env.PUBLIC_URL || '';
    // Always fetch from site root so nested routes (GitHub Pages deep links) work
    const resumeDataUrl = rootUrl.replace(/\/$/, '') + '/resumeData.json';
    $.ajax({
      url: resumeDataUrl,
      dataType: 'json',
      cache: false,
      success: (data) => this.setState({ resumeData: data }),
      error: (xhr, status, err) => {
        console.error('Failed to load resumeData.json from', resumeDataUrl, status, err);
        // Fallback attempt using absolute root (in case PUBLIC_URL not set)
        if (resumeDataUrl !== '/resumeData.json') {
          $.ajax({
            url: '/resumeData.json',
            dataType: 'json',
            cache: false,
            success: (data) => this.setState({ resumeData: data }),
            error: (xhr2, status2, err2) => {
              console.error('Fallback /resumeData.json also failed', status2, err2);
            }
          });
        }
      }
    });
  }

  componentDidMount() {
    this.getResumeData();
  }

  componentDidUpdate(prevProps, prevState) {
    // After data first loads OR route changes, perform smooth scroll if route/hash targets a section
    const justLoaded = !prevState.resumeData.main && this.state.resumeData.main;
    if (justLoaded) {
      this.performInitialScroll();
    }
    // Detect hash-based navigation changes after initial load
    if (this.state.lastHash !== window.location.hash) {
      this.setState({ lastHash: window.location.hash });
      this.performInitialScroll();
    }
  }

  performInitialScroll() {
    const raw = window.location.hash; // e.g. #/projects or #projects or #/resume
    if (!raw) return;
    let target = null;
    // Dedicated /projects route should still scroll to the projects section while rendering full page
    if (/^#\/projects(\/|$)/.test(raw)) {
      target = 'projects';
    } else if (raw.startsWith('#')) {
      target = raw.replace(/^#\/?/, '').split('/')[0];
    }
    if (!target) return;
    const el = document.getElementById(target);
    if (!el) return;
    // Retry a few times in case layout/images shift height after render
    const attemptScroll = (tries = 0) => {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 65;
      window.scrollTo({ top, behavior: 'smooth' });
      if (tries < 3) {
        // schedule micro-adjust
        setTimeout(() => attemptScroll(tries + 1), 160);
      }
    };
    // Slight delay so browser paints first
    setTimeout(() => attemptScroll(0), 80);
  }

  render() {
    if (!this.state.resumeData.main) {
      return <div>Loading...</div>;
    }
    return (
      <Router>
        <div className="App">
          <ErrorBoundary>
          {/* Persistent header across all routes */}
          <Header data={this.state.resumeData.main} />
          <Routes>
            <Route path="/" element={
              <>
                <About data={this.state.resumeData.main} />
                <Resume data={this.state.resumeData.resume} />
                <Projects data={this.state.resumeData.projects} />
                <Contact data={this.state.resumeData.main} />
              </>
            } />
            {/* Wildcard route: render full page for any unknown (section hashes land here too) */}
            <Route path="*" element={
              <>
                <About data={this.state.resumeData.main} />
                <Resume data={this.state.resumeData.resume} />
                <Projects data={this.state.resumeData.projects} />
                <Contact data={this.state.resumeData.main} />
              </>
            } />
            {/* Explicit /projects path renders full page then smooth-scrolls to projects via performInitialScroll */}
            <Route path="/projects" element={
              <>
                <About data={this.state.resumeData.main} />
                <Resume data={this.state.resumeData.resume} />
                <Projects data={this.state.resumeData.projects} />
                <Contact data={this.state.resumeData.main} />
              </>
            } />
            <Route path="/projects/cloud-health-dashboard" element={<CloudHealthDashboard />} />
            <Route path="/projects/log-analyzer-toolkit" element={<LogAnalyzerToolkit />} />
            <Route path="/projects/dynamodb-inventory-manager" element={<DynamoDBInventoryManager />} />
            <Route path="/projects/multicloud-iac" element={<MultiCloudIAC />} />
          </Routes>
          <Footer data={this.state.resumeData.main} />
          </ErrorBoundary>
        </div>
      </Router>
    );
  }
}

export default App;
