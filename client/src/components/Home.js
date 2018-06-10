import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from './Login';

class Home extends Component {
  render() {
    const user = this.props.user;
    if (user._id) {
      return(
        <div className="home container">
          <div className="text">
            <h1 className="textH1">Hey there.</h1>
            <p className="textP">Welcome to classify, the platform on which you can share your notes and summaries with all your classmates.</p>
            <Link to="/dashboard" className="btn btn-primary btn-lg">Dashboard</Link>
          </div>
        </div>
      );
    } else {
      return(
        <div className="home container">
          <div className="row">
            <div className="text col-lg-6 col-md-12">
              <h1 className="textH1">Hey there.</h1>
              <p className="textP">Welcome to classify, the platform on which you can share your notes and summaries with all your classmates. Collaborate, and never be frustrated again.</p>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="card">
               <div className="card-body">
                <Login {...this.props} heading={true}/>
               </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user
  }
}

export default connect(mapStateToProps, null)(Home);
