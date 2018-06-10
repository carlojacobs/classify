import React, { Component } from 'react';
import ListNote from './ListNote';

export default class Notes extends Component {

  constructor() {
    super();
    this.getElements = this.getElements.bind(this);
  }

  getElements() {
    const notes = this.props.notes;
    const user = this.props.user;
    var elements = [];
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const url = "/view/note/" + note._id;
      const newElement = (<ListNote update={this.props.update} user={user} note={note} url={url} key={i} />);
      elements.push(newElement);
    }
    return elements;
  }

  render() {
    const cards = this.getElements();
    const listGroup = (
      <div className="list-group list-group-notes">
        {cards}
      </div>
    );
    const emptyImage = (<img alt="funny empty gif" src="https://media.giphy.com/media/3oriff4xQ7Oq2TIgTu/giphy.gif"/>);
    if (cards.length !== 0) {
      return(listGroup);
    } else {
      return(emptyImage);
    }
  }
}
