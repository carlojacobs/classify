import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import axios from 'axios';
import { connect } from 'react-redux';

class Classes extends Component {

  constructor() {
    super();
    this.state = {
      inputData: {
        name: null,
        description: null,
        students: null
      },
      modal: false
    }
    // Bind methods
    this.getClassElements = this.getClassElements.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getClassElements() {
    const classes = this.props.classes;
    var elements = [];
    for (let i = 0; i < classes.length; i++) {
      const classObj = classes[i];
      const newElement = (
        <tr key={i}>
          <th scope="row">{i+1}</th>
          <td><Link to={"/view/class/" + classObj._id.toString()}>{classObj.name}</Link></td>
          <td>{classObj.creator.name}</td>
          <td>{classObj.createDate}</td>
        </tr>
      );
      elements.push(newElement);
    }
    return elements;
  }

  toggleModal() {
    this.setState({
      ...this.state,
      modal: !this.state.modal
    });
  }

  handleInputChange(e) {
    const target = e.target;
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

  handleSubmit(e) {
    this.props.toggleLoader();
    e.preventDefault();
    const url = "/classes/create_class";
    const { name, students, description } = this.state.inputData;
    const userId = this.props.user._id;
    // Make request
    axios.post(url, {
      name,
      description,
      students,
      creator: userId
    }).then((res) => {
      const success = res.data.success;
      if (success) {
        this.setState({
          ...this.state,
          modal: false
        });
        this.props.update();
        this.props.toggleLoader();
      }
    }).catch((err) => {
      console.log('Error', err);
    });
  }

  render() {
    const rows = this.getClassElements();
    const modal = (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>New class</ModalHeader>
          <ModalBody>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input onChange={this.handleInputChange} name="name" type="text" className="form-control" placeholder="Name"/>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input onChange={this.handleInputChange} type="text" name="description" className="form-control" placeholder="Keep it short but powerful"/>
              </div>
              <div className="form-group">
                <label>Students</label>
                <input type="text" onChange={this.handleInputChange} name="students" className="form-control" placeholder="Email seperated by ','"/>
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </ModalBody>
        </Modal>
      </div>
    );

    return(
      <div className="card">
				<div className="card-header">
          <button id="add-class-button" onClick={this.toggleModal} className="btn btn-dark">New class</button>
				</div>
        <div className="card-block">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Class Name</th>
                <th scope="col">Creator</th>
                <th scope="col">Create date</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
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

export default connect(mapStateToProps, null)(Classes);
