// Dashboard
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Actions
import { getData } from '../actions/dataActions';
import { updateNotes, updateStars } from '../actions/notesActions';
import { updateClasses } from '../actions/classesActions';

// Components
import Header from './Header';
import Classes from './Classes';
import Breadcrumb from './Breadcrumb';
import Notes from './Notes';
import Menu from './Menu';
import Unauth from './Unauth';
import Overview from './Overview';
import Profile from './Profile';

class Dashboard extends Component {

  constructor() {
    super();
    // Bind methods
    this.getElement = this.getElement.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.update = this.update.bind(this);
  }

  fetchData() {
    const user = this.props.user;
    getData(user, (err, data) => {
      if (err) {
        console.log(err)
      }
      if (data) {
        const { notes, classes, stars } = data;
        this.props.updateClasses(classes);
        this.props.updateNotes(notes);
        this.props.updateStars(stars);
      }
    });
  }

  componentWillMount() {
    this.fetchData();
  }

  update() {
    // Fetch data again
    this.fetchData();
  }

  getElement() {
    const path = this.props.location.pathname;
    const { user, classes, notes, stars } = this.props;
    const numOfClasses = classes.length;
    const numOfNotes = notes.length;
    if (!user.name) {
      return(<Unauth/>)
    } else if (path === "/dashboard") {
      return(<Overview user={this.props.user} numOfClasses={numOfClasses} numOfNotes={numOfNotes}/>);
    } else if (path === "/dashboard/classes") {
      return(<Classes toggleLoader={this.props.toggleLoader} update={this.update} classes={classes}/>);
    } else if (path === "/dashboard/notes") {
      return(<Notes update={this.update} notes={notes} user={user}/>);
    } else if (path === "/dashboard/starred") {
      return(<Notes update={this.update} notes={stars} user={user}/>);
    } else if (path === "/dashboard/profile") {
      return(<Profile toggleLoader={this.props.toggleLoader} history={this.props.history}/>);
    }
  }

  render() {
    const element = this.getElement();
    const path = this.props.location.pathname;
    const breadcrumbPath = path.split('/');
    breadcrumbPath.splice(0, 1);
    const name = this.props.user.name;
    const numbers = {
      numOfClasses: this.props.classes.length,
      numOfNotes: this.props.notes.length,
      numOfStars: this.props.stars.length
    }
    return(
      <div>
        <Header name={name}/>
        <Breadcrumb items={breadcrumbPath}/>
        <section id="main">
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <Menu {...this.props} numbers={numbers}/>
              </div>
              <div className="col-md-9 dashboardstuff">
                {element}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    classes: state.classes.classes,
    notes: state.notes.notes,
    stars: state.notes.stars
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateClasses: (classes) => {
      dispatch(updateClasses(classes));
    },
    updateNotes: (notes) => {
      dispatch(updateNotes(notes));
    },
    updateStars: (stars) => {
      dispatch(updateStars(stars));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
