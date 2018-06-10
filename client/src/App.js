// App.js
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

/*
Todo:
Register
Classes
Notes
Create class
Post note in class
post private note
profile
update profile
*/

// Css
import './stylesheets/App.css';

// Components
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Unauth from './components/Unauth';
import About from './components/About';
import Home from './components/Home';
import Note from './components/Note';
import Class from './components/Class';
import Register from './components/Register';
import Overlay from './components/Overlay';

class App extends Component {

  constructor() {
    super();
    this.state = {
      loading: false,
      confirm: false
    }
    // Bind methods
    this.toggleLoader = this.toggleLoader.bind(this);
    this.toggleConfirm = this.toggleConfirm.bind(this);
  }

  toggleLoader(confirm) {
    this.setState({
      ...this.state,
      loading: !this.state.loading
    }, () => {
      if (confirm) {
        this.toggleConfirm();
      }
    });
  }

  toggleConfirm() {
    const toggle = () => {
      this.setState({
        ...this.state,
        confirm: !this.state.confirm
      })
    }
    toggle();
    setTimeout(toggle, 700);
  }

  render() {
    const loading = this.state.loading;
    const confirm = this.state.confirm;
    var loadingStyle;
    var confirmStyle;
    if (confirm) {
      confirmStyle = {display: 'block'}
    } else {
      confirmStyle = {display: 'none'}
    }
    if (loading) {
      loadingStyle = {display: 'block'}
    } else {
      loadingStyle = {display: 'none'}
    }
		return (
      <div>
        <Overlay element={"loader"} style={loadingStyle}/>
        <Overlay element={"confirm"} style={confirmStyle}/>
        <div>
          <Router>
            <div>
              <Route path="/" component={Navbar}/>
              <Route path="/about" exact component={About}/>
              <Route path="/" exact render={(props) => {
                return(<Home {...props} toggleLoader={this.toggleLoader}/>);
              }}/>
              <Route path="/view/note/:noteId" exact render={(props) => {
                const user = this.props.user;
                if (!user._id) {
                  return(<Unauth/>);
                } else {
                  return(<Note {...props}/>);
                }
              }}/>
              <Route path="/view/class/:classId" exact render={(props) => {
                const user = this.props.user;
                if (!user._id) {
                  return(<Unauth/>);
                } else {
                  return(<Class {...props} toggleLoader={this.toggleLoader}/>);
                }
              }}/>
              <Route path="/dashboard" render={(props) => {
                const user = this.props.user;
                if (!user._id) {
                  return(<Unauth/>);
                } else {
                  return(<Dashboard {...props} toggleLoader={this.toggleLoader}/>);
                }
              }}/>
              <Route path="/login" exact render={(props) => {
                const style = {
                  marginTop: '2rem'
                }
                return(<div style={style}><Login {...props} toggleLoader={this.toggleLoader} heading={true}/></div>);
              }}/>
              <Route path="/register" exact render={(props) => {
                const style = {
                  marginTop: '2rem'
                }
                return(<div style={style}><Register {...props} toggleLoader={this.toggleLoader} heading={true}/></div>);
              }}/>
            </div>
          </Router>
        </div>
      </div>
		);
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user
  }
}

export default connect(mapStateToProps, null)(App);
