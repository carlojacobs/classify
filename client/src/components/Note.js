import React, { Component } from 'react'
import { connect } from 'react-redux';

class Note extends Component {

  constructor() {
    super();
    this.state = {
      note: {}
    }
    this.getNote = this.getNote.bind(this);
  }

  getNote() {
    const noteId = this.props.match.params.noteId;
    const { notes, stars } = this.props;
    notes.forEach(note => {
      if (note._id === noteId) {
        this.setState({
          ...this.state,
          note
        });
        return;
      }
    });
    stars.forEach(star => {
      if (star._id === noteId) {
        this.setState({
          ...this.state,
          note: star
        });
        return;
      }
    });
  }

  componentWillMount() {
    this.getNote();
  }

  render() {
    const note = this.state.note;
    return(
      <div className="card note-card">
        <div className="card-body">
          <button onClick={() => this.props.history.goBack()} style={{float: 'right', display: 'inline'}} className="card-link btn btn-secondary">Back</button>
          <h4 className="card-title">{note.title}</h4>
          <h6 className="card-subtitle mb-2 text-muted">{note.createDate}</h6>
          <p className="note-body-p" dangerouslySetInnerHTML={{__html: note.body}}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    notes: state.notes.notes,
    stars: state.notes.stars
  }
}

export default connect(mapStateToProps, null)(Note);