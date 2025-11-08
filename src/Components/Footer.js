import React, { Component } from "react";

class Footer extends Component {
  render() {
    if (!this.props.data) return null;

    const networks = this.props.data.social.map(function (network) {
      return (
        <li key={network.name}>
          <a href={network.url}>
            <i className={network.className}></i>
          </a>
        </li>
      );
    });

    return (
      <footer>
      <div className="row">
        <div className="twelve columns">
          <ul className="social-links">{networks}</ul>

          <ul className="copyright">
          <li>&copy; Copyright 2025</li>
          <li>
            Developed and Maintained By{" "}
            <a title="Styleshout" href="https://github.com/dregraham">
            Dre Graham
            </a>
          </li>
          </ul>
        </div>

         {/* go-top removed per request */}
      </div>
      </footer>
    );
  }
}

export default Footer;
