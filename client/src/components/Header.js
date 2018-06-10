import React, { Component } from 'react';

export default class Header extends Component {
	render() {
		const firstName = this.props.name.split(' ')[0];
		return(
			<header id="header">
				<div className="container">
					<div className="row">
						<div className="col-md-10">
							<h1>Dashboard <small>Welcome, {firstName}!</small></h1>
						</div>
					</div>
				</div>
			</header>
		);
	}
}
