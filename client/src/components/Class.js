import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

// Components
import ListNote from './ListNote';
import ClassSettings from './ClassSettings';

// Actions
import { getData } from '../actions/dataActions';
import { updateNotes } from '../actions/notesActions';

class Class extends Component {

  constructor() {
    super();
    this.state = {
      class: {
        creator: {
          _id: null
        },
        name: "Class",
        description: "Class",
        students: []
      },
      element: "notes",
      notes: [],
      modal: false,
      inputData: {
        title: null,
        body: null
      }
    }
    // Bind methods
    this.getClass = this.getClass.bind(this);
    this.getStudentListGroup = this.getStudentListGroup.bind(this);
    this.toggle = this.toggle.bind(this);
    this.getElement = this.getElement.bind(this);
    this.getNotesListGroup = this.getNotesListGroup.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.checkIfOwner = this.checkIfOwner.bind(this);
  }

  getClass() {
    this.props.toggleLoader();    
    const classId = this.props.match.params.classId;
    const url = "/classes/class/" + classId;
    axios.get(url).then((res) => {
      const { notes, classObj } = res.data;
      this.setState({
        ...this.state,
        notes: notes,
        class: classObj
      });
      this.props.updateNotes(notes);
      this.props.toggleLoader();      
    }).catch((err) => {
      console.log(err);
    });
  }

  componentWillMount() {
    this.getClass();
  }

  getStudentListGroup(classObj) {
    const items = [];
    for (let i = 0; i < classObj.students.length; i++) {
      const student = classObj.students[i];
      const newItem = (
        <li key={i} className="list-group-item">{student._id === classObj.creator._id ? "(owner) " : null}<b><strong>{student.name}</strong></b> {student.email}</li>
      );
      items.push(newItem);
    }
    return (
      <div className="list-group list-group-students">
        {items}
      </div>
    );
  }

  getNotesListGroup(notes) {
    const items = [];
    if (notes.length === 0) {
      const emptyImage = (<img alt="funny empty gif" src="https://media.giphy.com/media/3oriff4xQ7Oq2TIgTu/giphy.gif" />);
      return (emptyImage);
    }
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const url = "/view/note/" + note._id;
      const user = this.props.user;
      const newItem = (<ListNote user={user} update={this.getClass} note={note} url={url} key={i} />);
      items.push(newItem);
    }
    return (
      <div className="list-group list-group-notes">
        {items}
      </div>
    );
  }

  toggle(toElement) {
    this.setState({
      ...this.state,
      element: toElement
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
    const url = "/notes/post";
    const { title, body } = this.state.inputData;
    const userId = this.props.user._id;
    const classId = this.state.class._id;
    // Make request
    axios.post(url, {
      title,
      body,
      author: userId,
      classId
    }).then((res) => {
      const success = res.data.success;
      if (success) {
        this.setState({
          ...this.state,
          modal: false
        });
        getData(this.props.user, (err, data) => {
          if (err) {
            console.log(err)
          }
          if (data) {
            const { notes } = data;
            this.props.updateNotes(notes);
            this.getClass();
            this.props.toggleLoader();            
          }
        });
      }
    }).catch((err) => {
      console.log('Error', err);
    });
  }

  toggleModal() {
    this.setState({
      ...this.state,
      modal: !this.state.modal
    });
  }

  getElement() {
    const element = this.state.element;
    const classObj = this.state.class;
    const notes = this.state.notes;
    if (element === "students") {
      const group = this.getStudentListGroup(classObj);
      return group;
    } else if (element === "notes") {
      const group = this.getNotesListGroup(notes);
      return group;
    } else if (element === "settings") {
      return (<ClassSettings update={this.getClass} toggleLoader={this.props.toggleLoader} history={this.props.history} class={classObj} />);
    }
  }

  checkIfOwner(classObj) {
    const user = this.props.user;
    if (user._id === classObj.creator._id) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const classObj = this.state.class;
    const element = this.getElement();
    const currentElement = this.state.element;
    const numOfStudents = this.state.class.students.length;
    const numOfNotes = this.state.notes.length;
    const isOwner = this.checkIfOwner(classObj);
    const modal = (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>New note</ModalHeader>
          <ModalBody>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input onChange={this.handleInputChange} name="title" type="text" className="form-control" placeholder="Title" />
              </div>
              <div className="form-group">
                <label>Body</label>
                <textarea onChange={this.handleInputChange} name="body" className="form-control" placeholder="Body" />
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </ModalBody>
        </Modal>
      </div>
    );

    return (
      <section id="main">
        <div className="container classView">
          <div className="row">
            <div className="class-header col-12">
              <h1><strong>{classObj.name}</strong></h1>
              <h4><i>{classObj.description}</i></h4>
              <hr />
            </div>
            <div className="list-group col-12">
              <div className="row">
                <div className="col-md-3">
                  <div className="list-group">
                    <li className={currentElement === "notes" ? "list-group-item menu-item-active menu-item" : "list-group-item menu-item"} onClick={() => this.toggle("notes")}><i className="fas fa-pencil-alt"></i> Notes <span className="badge badge-secondary">{numOfNotes}</span></li>
                    <li className={currentElement === "students" ? "list-group-item menu-item-active menu-item" : "list-group-item menu-item"} onClick={() => this.toggle("students")}><i className="fas fa-users"></i> Students <span className="badge badge-secondary">{numOfStudents}</span></li>
                    {isOwner ? <li className={currentElement === "settings" ? "list-group-item menu-item-active menu-item" : "list-group-item menu-item"} onClick={() => this.toggle("settings")}><i className="fas fa-cog"></i> Settings</li> : null}
                  </div>
                  <br />
                  <button className="btn btn-dark" onClick={() => this.props.history.goBack()}><i className="fas fa-caret-square-left"></i> Back</button>
                  <button style={{ marginLeft: '1rem' }} className="btn btn-primary" onClick={this.toggleModal}><i className="fas fa-pencil-alt"></i> New note</button>
                </div>
                <div className="col-md-9">
                  {element}
                </div>
              </div>
            </div>
          </div>
        </div>
        {modal}
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    classes: state.classes.classes,
    user: state.user.user,
    notes: state.notes.notes,
    stars: state.notes.stars
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateNotes: (notes) => {
      dispatch(updateNotes(notes));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Class);
