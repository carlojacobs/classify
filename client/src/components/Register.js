import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

// actions
import { updateUser } from '../actions/userActions';

// css
import '../stylesheets/login.css';

class Register extends Component {

  constructor() {
    super();
    this.state = {
      inputData: {
        email: null,
        password: null,
        name: null
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
    const url = "/users/register";
    const inputData = this.state.inputData;
    axios.post(url, {
      email: inputData.email,
      password: inputData.password,
      name: inputData.name
    }).then((res) => {
      const success = res.data.success;
      const message = res.data.message;
      if (message) {
        this.setState({
          ...this.state,
          alert: message
        })
      }
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
    const valid = this.props.valid;
    var heading;
    if (headingProp) {
      heading = (<h2 className="form-signin-heading">Sign up</h2>);
    }
    return(
      <div className="container login">
        <form className="form-signin" onSubmit={this.onSubmit}>
          {heading}
          <div className="form-group">
            <label>Name</label>
            <input className="loginInput" autoComplete="on" type="text" name="name" id="inputName" className="form-control" placeholder="Full name" required autoFocus onChange={this.handleInputChange}/>
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input className="loginInput" autoComplete="on" type="email" name="email" id="inputEmail" className={valid ? "form-control" : "form-control is-invalid"} placeholder="Email address" required autoFocus onChange={this.handleInputChange}/>
            <div className="invalid-feedback">
              This email has already been used.
            </div>
          </div>   
          <div className="form-group">
            <label>Password</label>
            <input className="loginInput" autoComplete="on" type="password" name="password" id="inputPassword" className="form-control" placeholder="Password" required onChange={this.handleInputChange}/>
          </div>
          <button className="btn btn-lg btn-primary btn-block" type="submit">Sign up</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);