import React, { Component } from 'react';

export default class Breadcrumb extends Component {
  render() {
    const items = this.props.items;
    var itemsArray = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (i !== items.length - 1) {
        const newItem = (
          <li key={i} className="breadcrumb-item">{item}</li>
        );
        itemsArray.push(newItem);
      } else {
        const newItem = (
          <li key={i} className="breadcrumb-item active">{item}</li>
        );
        itemsArray.push(newItem);
      }
    }
    return(
      <section id="breadcrumb">
        <div className="container">
          <ol className="breadcrumb">
            {itemsArray}
          </ol>
        </div>
      </section>
    );
  }
}
