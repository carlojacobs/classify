import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Navbar extends Component {

  constructor() {
    super();
    this.getButtons = this.getButtons.bind(this);
    this.state = {
      collapse: false
    }
  }

  getButtons() {
    const user = this.props.user;
    const path = this.props.location.pathname;
    // Active classes
    const loginClass = path === "/login" ? "active" : "";
    const registerClass = path === "/register" ? "active" : "";
    const dashboardSplit = path.split("/");
    const dashboardClass = dashboardSplit[1] === "dashboard" ? "active" : "";
    if (!user._id) {
      return(
        <ul className="navbar-nav ml-auto">
          <li className={"nav-item " + loginClass}><Link className="nav-link" to="/login">Login</Link></li>
          <li className={"nav-item " + registerClass}><Link className="nav-link" to="/register">Register</Link></li>
        </ul>
      );
    } else {
      return(
        <ul className="navbar-nav ml-auto">
          <li className={"nav-item " + dashboardClass}><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
          <li className="nav-item"><a className="nav-link" href="">Logout</a></li>
        </ul>
      );
    }
  }

  render() {
    const buttons = this.getButtons();
    const path = this.props.location.pathname;
    const aboutClass = path === "/about" ? "active" : "";
    const homeClass = path === "/" ? "active" : "";
    return(
      <nav className="navbar navbar-expand-lg navbar-dark">
        <a className="navbar-brand" href="">Classify</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarsExampleDefault">
          <ul className="navbar-nav mr-auto">
            <li className={"nav-item " + homeClass}>
              <Link className="nav-link" to="/">  Home</Link>
            </li>
            <li className={"nav-item " + aboutClass}>
              <Link className="nav-link" to="/about">  About</Link>
            </li>
          </ul>
          {buttons}
        </div>
      </nav>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user
  }
}

export default connect(mapStateToProps, null)(Navbar);
