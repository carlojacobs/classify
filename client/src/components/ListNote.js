import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';

// Actions
import { updateStars } from '../actions/notesActions';

class ListNote extends Component {

  constructor() {
    super();
    this.state = {
      isStar: false
    }
    // Bind methods
    this.star = this.star.bind(this);
    this.checkIfStar = this.checkIfStar.bind(this);
    this.updateStars = this.updateStars.bind(this);
  }

  star(noteId, userId) {
    const url = "/notes/favourite/" + userId + "/" + noteId;
    // const url = "http://localhost:8000/notes/favourite/" + userId + "/" + noteId;
    axios.get(url).then((res) => {
      const success = res.data.success;
      const message = res.data.message;
      if (success) {
        console.log(message);
        this.updateStars();
      } else {
        console.log(message);
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  updateStars() {
    const url = "/notes/favourites/" + this.props.user._id;
    axios.get(url).then((res) => {
      const stars = res.data.favourites;
      this.props.updateStars(stars);
    }).catch((err) => {
      console.log(err);
    })
  }

  checkIfStar() {
    const stars = this.props.stars;
    const note = this.props.note;
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      if (star._id === note._id) {
        return true;
      }
    }
    return false;
  }

  render() {
    const note = this.props.note;
    const userId = this.props.user._id;
    const noteId = note._id;
    const url = this.props.url;
    const isStar = this.checkIfStar();
    // Figure out withClass
    var withClass = null;
    if (note.classId) {
      withClass = (<small>{note.classId.name}</small>);
    }
    var starButtonImage;
    if (isStar) {
      starButtonImage = (<i className="fas fa-star"></i>);
    } else {
      starButtonImage = (<i className="far fa-star"></i>);
    }
    const btnStyle = {
      float: 'right',
      marginLeft: '1rem'
    }
    return(
      <div className="list-group-item flex-column align-items-start">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">{note.title}</h5>
          <small>{note.createDate}</small>
        </div>
        <p className="mb-1" dangerouslySetInnerHTML={{__html: note.body.substring(0, 50)}}></p>
        <small>{note.author.name}</small>
        <br/>
        {withClass}
        <button className={isStar ? "btn btn-warning" : "btn btn-outline-warning"} style={btnStyle} onClick= {() => this.star(noteId, userId)}>{starButtonImage}</button>
        <Link style={btnStyle} className="btn btn-primary" to={url}>View</Link>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    stars: state.notes.stars
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateStars: (stars) => {
      dispatch(updateStars(stars));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListNote);