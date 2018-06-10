import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// actions
import { updateUser } from '../actions/userActions';

// css
import '../stylesheets/login.css';

class Login extends Component {

  constructor() {
    super();
    this.state = {
      inputData: {
        email: null,
        password: null
      },
      valid: true
    }
    // bind methods
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      ...this.state,
      inputData: {
        ...this.state.inputData,
        [name]: value
      }
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.toggleLoader();
    const url = "/users/login";
    // const url = "http://localhost:8000/users/login"
    const inputData = this.state.inputData;
    axios.post(url, {
      email: inputData.email,
      password: inputData.password
    }).then((res) => {
      const success = res.data.success;
      if (success) {
        const user = res.data.user;
        this.props.updateUser(user);
        this.setState({
          ...this.state,
          valid: true
        });
        this.props.toggleLoader();
        this.props.history.push("/dashboard");
      } else {
        this.setState({
          ...this.state,
          valid: false
        });
        this.props.toggleLoader();
      }
    }).catch((err) => {
      console.log('Error', err);
    })
  }

  render() {
    const headingProp = this.props.heading;
    const valid = this.state.valid;
    var heading;
    if (headingProp) {
      heading = (<h2 className="form-signin-heading">Sign in</h2>);
    }
    return(
      <div className="">
        <form className="form-signin" onSubmit={this.onSubmit}>
          {heading}
          <div className="form-group">
            <label>Email address</label>
            <input className="loginInput" autoComplete="on" type="email" name="email" id="inputEmail" className="form-control" placeholder="Email address" required autoFocus onChange={this.handleInputChange}/>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="loginInput" autoComplete="on" type="password" name="password" id="inputPassword" className={valid ? "form-control" : "form-control is-invalid"} placeholder="Password" required onChange={this.handleInputChange}/>
            <div className="invalid-feedback">
              Oops! The email or password was invalid...
            </div>
          </div>
          <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
          <Link to="/register">Or Sign up</Link>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (user) => {
      dispatch(updateUser(user));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
