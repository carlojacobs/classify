import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Unauth extends Component {
  render() {
    return(
      <div className="container unauth">
        <div className="jumbotron">
          <h1>Oops! You are not logged in...</h1>
          <Link to="/login" className="btn btn-lg btn-primary unauth-button">Sign in</Link>
          <p id="unauth-p">or</p>
          <Link to="/register" className="btn btn-lg btn-primary unauth-button">Sign up</Link>
        </div>
      </div>
    );
  }
}