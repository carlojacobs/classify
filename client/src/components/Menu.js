import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Menu extends Component {

	constructor() {
		super();
		this.getActiveItem = this.getActiveItem.bind(this);
	}

	getActiveItem() {
		const path = this.props.location.pathname;
		switch(path) {
			case "/dashboard":
				return "dashboard";
			case "/dashboard/classes":
				return "classes";
			case "/dashboard/notes":
				return "notes";
			case "/dashboard/profile":
				return "profile";
			case "/dashboard/starred":
				return "starred";
			default:
				return "/dashboard"
		}
	}

	render() {
		const activeItem = this.getActiveItem();
		const { numOfClasses, numOfNotes, numOfStars } = this.props.numbers;
		return(
			<div className="list-group">
				<Link to="/dashboard" className={activeItem === "dashboard" ? "list-group-item menu-item-active menu-item" : "list-group-item menu-item"}><i className="fas fa-compass"></i> Dashboard</Link>
				<Link to="/dashboard/classes" className={activeItem === "classes" ? "list-group-item menu-item-active menu-item" : "list-group-item menu-item"}><i className="fas fa-users"></i> Classes <span className="badge badge-secondary">{numOfClasses}</span></Link>
				<Link to="/dashboard/notes" className={activeItem === "notes" ? "list-group-item menu-item-active menu-item" : "list-group-item menu-item"}><i className="fas fa-pencil-alt"></i> My Notes <span className="badge badge-secondary">{numOfNotes}</span></Link>
				<Link to="/dashboard/starred" className={activeItem === "starred" ? "list-group-item menu-item-active menu-item" : "list-group-item menu-item"}><i className="fas fa-star"></i> Starred <span className="badge badge-secondary">{numOfStars}</span></Link>
				<Link to="/dashboard/profile" className={activeItem === "profile" ? "list-group-item menu-item-active menu-item" : "list-group-item menu-item"}><i className="fas fa-user"></i> Profile</Link>
			</div>
		);
  }
}
