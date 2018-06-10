import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ClassSettings extends Component {

  constructor() {
    super();
    this.state = {
      inputData: {
        newUserEmail: null,
        newClassDescription: null,
        newClassName: null
      },
      modal: false,
      emailIsValid: true
    }
    // Bind methods
    this.getStudentListGroup = this.getStudentListGroup.bind(this);
    this.removeStudent = this.removeStudent.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleNewStudentSubmit = this.handleNewStudentSubmit.bind(this);
    this.handleClassChangeSubmit = this.handleClassChangeSubmit.bind(this);
    this.deleteClass = this.deleteClass.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  removeStudent(student) {
    const url = "/classes/delete_user";
    const data = {
      userId: student._id,
      classId: this.props.class._id
    }
    axios.post(url, data).then((res) => {
      const success = res.data.success;
      if (success) {
        this.props.update();
      } else {
        console.log('Fail');
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  toggleModal() {
    this.setState({
      ...this.state,
      modal: !this.state.modal
    });
  }

  getStudentListGroup() {
    const classObj = this.props.class;
    var items = [];
    classObj.students.forEach(student => {
      var button = null;
      if (classObj.creator._id !== student._id) {
        button = (<button style={{float: 'right'}} onClick={() => this.removeStudent(student)} className="btn btn-danger">Remove student</button>);
      }
      const newItem = (
        <li key={student._id} className="list-group-item">
          {student._id === classObj.creator._id ? "(owner) " : null}<b><strong>{student.name}</strong></b> {student.email}
          {button}
        </li>
      );
      items.push(newItem);
    });
    return(
      <div className="list-group">
        {items}
      </div>
    );
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

  handleNewStudentSubmit(e) {
    this.props.toggleLoader(false);    
    e.preventDefault();
    const url = "/classes/add_user";
    const data = {
      userEmail: this.state.inputData.newUserEmail,
      classId: this.props.class._id 
    }
    axios.post(url, data).then((res) => {
      const success = res.data.success;
      if (success) {
        this.setState({
          ...this.state,
          emailIsValid: true
        });
        this.props.update();
        this.props.toggleLoader(false);        
      } else {
        this.setState({
          ...this.state,
          emailIsValid: false
        });
        this.props.toggleLoader(false);
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  handleClassChangeSubmit(e) {
    this.props.toggleLoader(false);    
    e.preventDefault();
    const newClass = this.props.class;
    const { newClassName, newClassDescription } = this.state.inputData;
    if (newClassName !== null) {
      newClass.name = newClassName;      
    }
    if (newClassDescription !== null) {
      newClass.description = newClassDescription;
    }
    const url = "/classes/save_class";
    // const url = "http://localhost:8000/classes/save_class";
    axios.post(url, {
      classObj: newClass
    }).then((res) => {
      const success = res.data.success;
      if (success) {
        this.props.update();
        this.props.toggleLoader(true); 
      } else {
        console.log('Fail');
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  deleteClass() {
    this.props.toggleLoader();    
    const classObj = this.props.class;
    const user = this.props.user;
    const url = "/classes/delete_class";
    axios.post(url, {
      userId: user._id,
      classId: classObj._id
    }).then((res) => {
      const success = res.data.success;
      if (success) {
        this.props.toggleLoader(true);        
        this.props.history.push('/dashboard/classes');
      } else {
        this.props.toggleLoader();
        console.log('Fail');
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {
    const classObj = this.props.class;
    const studentListGroup = this.getStudentListGroup();
    const emailIsValid = this.state.emailIsValid;

    const modal = (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
          <ModalHeader toggle={this.toggleModal}>Delete class</ModalHeader>
          <ModalBody>
            You sure?
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-secondary" onClick={this.toggleModal}>Never mind.</button>
            <button className="btn btn-danger" onClick={this.deleteClass}>I'm sure.</button>
          </ModalFooter>
        </Modal>
      </div>
    );

    return(
      <div className="settings">
        <h3>Students</h3>
        <p className="lead">All Students</p>
        {studentListGroup}
        <br/>
        <p className="lead">Add student</p>
        <form className="form-inline" onSubmit={this.handleNewStudentSubmit}>
          <div className="form-group mx-sm-3 mb-2">
            <label>Email</label>
            <input autoComplete="off" name="newUserEmail" onChange={this.handleInputChange} type="email" className={emailIsValid ? "form-control mx-sm-3" : "form-control is-invalid mx-sm-3"}placeholder="New student email"/>
            <div className="invalid-feedback">
              Oops! The email in invalid...
            </div>
          </div>
          <button type="submit" className="btn btn-primary mb-2">Add student</button>
        </form>
        <hr/>
        <h3>Info</h3>
        <form className="form-inline" onSubmit={this.handleClassChangeSubmit}>
          <div className="form-group mx-sm-3 mb-2">
            <label htmlFor="inputName">Name</label>
            <input id="inputName" autoComplete="off" name="newClassName" onChange={this.handleInputChange} type="text" className="form-control mx-sm-3" placeholder={classObj.name}/>
          </div>
          <div className="form-group mx-sm-3 mb-2">
            <label htmlFor="inputDescription">Description</label>
            <input autoComplete="off" id="inputDescription" name="newClassDescription" onChange={this.handleInputChange} type="text" className="form-control mx-sm-3" placeholder={classObj.description}/>
          </div>
          <button type="submit" className="btn btn-primary mb-2">Update class</button>
        </form>
        <hr/>
        <h3 style={{color: 'red'}}><i>Danger Zone</i></h3>
        <br/>
        <button className="btn btn-block btn-danger" onClick={this.toggleModal}>Delete class</button>        
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

export default connect(mapStateToProps, null)(ClassSettings);