import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

// Actions
import { updateUser } from '../actions/userActions';

class Profile extends Component {

  constructor() {
    super();
    this.state = {
      inputData: {
        email: null,
        password: null,
        passwordVerify: null
      },
      valid: true,
      modal: false
    }
    // Bind methods
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
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

  toggleModal() {
    this.setState({
      ...this.state,
      modal: !this.state.modal
    });
  }

  handleEmailSubmit(e) {
    this.props.toggleLoader(false);
    e.preventDefault();
    const url = "/update_email";
    const email = this.state.inputData.email;
    const userId = this.props.user._id;
    axios.post(url, {
      email,
      userId
    }).then((res) => {
      const success = res.data.success;
      if (success) {
        const user = res.data.user;
        this.props.updateUser(user);
        this.props.toggleLoader(true);
      } else {
        const message = res.data.message;
        console.log(message);
      }
    }).catch((err) => {
      console.log('Error', err);
    })
  }

  handlePasswordSubmit(e) {
    e.preventDefault();
    const url = "/update_password";
    // const url = "http://localhost:8000/update_password";
    const { password, passwordVerify } = this.state.inputData;
    const userId = this.props.user._id;
    // Check if passwords match
    if (password === passwordVerify) {
      this.props.toggleLoader(false);
      this.setState({
        valid: true
      });
      const currentPassword = this.props.user.password;
      axios.post(url, {
        currentPassword,
        newPassword: password,
        userId
      }).then((res) => {
        const success = res.data.success;
        if (success) {
          const user = res.data.user;
          this.props.updateUser(user);
          this.props.toggleLoader(true);
        } else {
          const message = res.data.message;
          console.log(message);
        }
      }).catch((err) => {
        console.log('Error', err);
      })
    } else {
      this.setState({
        ...this.state,
        valid: false
      });
    }
  }

  deleteAccount() {
    this.props.toggleLoader(false);
    const userId = this.props.user._id;
    const url = "/users/delete_account/" + userId;
    axios.get(url).then((res) => {
      const success = res.data.success;
      if (success) {
        this.props.updateUser({});
        this.props.toggleLoader(true);
        this.props.history.push('/');
      } else {
        console.log('Fail');
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {

    const modal = (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
          <ModalHeader toggle={this.toggleModal}>Delete class</ModalHeader>
          <ModalBody>
            You sure?
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-secondary" onClick={this.toggleModal}>Never mind.</button>
            <button className="btn btn-danger" onClick={this.deleteAccount}>I'm sure.</button>
          </ModalFooter>
        </Modal>
      </div>
    );

    const user = this.props.user;
    const valid = this.state.valid;
    return(
      <div>
        <h1>{user.name}</h1>
        <br/>
        <p>Email</p>
        <form onSubmit={this.handleEmailSubmit} >
          <div className="form-row">
            <div className="col">
              <input autoComplete="off" onChange={this.handleInputChange} name="email" type="text" className="form-control" placeholder={user.email}/>
            </div>
            <div className="col">
              <button type="submit" className="btn btn-primary">Update Email</button>
            </div>
          </div>
        </form>
        <br/>
        <p>Password</p>
        <form onSubmit={this.handlePasswordSubmit}>
          <div className="form-row">
            <div className="col">
              <input autoComplete="off" onChange={this.handleInputChange} name="password" type="password" className={valid ? "form-control" : "form-control is-invalid"} placeholder="New Password"/>
              <div className="invalid-feedback">
                Passwords don't match
              </div>
            </div>
            <div className="col">
              <input autoComplete="off" onChange={this.handleInputChange} name="passwordVerify" type="password" className={valid ? "form-control" : "form-control is-invalid"} placeholder="Verify New Password"/>
              <div className="invalid-feedback">
                Passwords don't match
              </div>
            </div>
            <div className="col">
              <button type="submit" className="btn btn-primary">Update Password</button>
            </div>
          </div>
        </form>
        <br/>
        <p style={{color: 'red'}}>Danger Zone</p>
        <button className="btn btn-block btn-danger" onClick={this.toggleModal}>Delete Account</button>
        {modal}
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
