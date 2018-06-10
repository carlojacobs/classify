import React, { Component } from 'react';

class Overlay extends Component {
  render() {
    const element = this.props.element;
    const style = this.props.style;
    if (element === "confirm") {
      return(<div id="overlay" style={style}><div className="confirm"><i id="confirmIcon" className="fas fa-check fa-7x"></i></div></div>);
    } else if (element === "loader") {
      return(<div id="overlay" style={style}><div className="loader"></div></div>);
    }
  }
}

export default Overlay;