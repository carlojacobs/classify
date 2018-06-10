import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Overview extends Component {
	render() {
		const name = this.props.user.name.split(' ')[0];
		const classesWord = (this.props.numOfClasses == 1) ? "class" : "classes";
		const notesWord = (this.props.numOfNotes == 1) ? "note" : "notes";
		return(
			<div>
				<div className="card">
					<h5 className="card-header">Hello, {name}!</h5>
					<div className="card-body">
						<div className="row">
							<div className="col-md-6">
								<div className="card">
									<div className="card-body">
										<h4 className="card-title">Classes</h4>
										<p className="card-text">You currently have {this.props.numOfClasses} {classesWord}.</p>
										<Link to="/dashboard/classes" className="btn btn-primary">View my classes</Link>
									</div>
								</div>
							</div>
							<div className="col-md-6">
								<div className="card">
									<div className="card-body">
										<h4 className="card-title">Notes</h4>
										<p className="card-text">You currently have {this.props.numOfNotes} {notesWord}.</p>
										<Link to="/dashboard/notes" className="btn btn-primary">View my notes</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
