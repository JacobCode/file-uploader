import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { signOut } from '../redux/actions/actions';

class Navbar extends Component {
	constructor() {
		super();
		this.logout = this.logout.bind(this);
	}
	logout() {
		this.props.signOut();
		localStorage.clear();
		window.location.pathname = '/signin';
	}
	render() {
		return (
			<div className="header d-flex justify-content-between align-items-center mb-4">
				<h1 className="mb-4 mt-4" style={{ fontSize: '1.5rem' }}>File Uploader</h1>
				<div className="links d-flex justify-content-between align-items-center">
					<a className="mr-3" href="/uploads">My Uploads</a>
					{this.props.user.username === null ? 
					<a href="/signin">Sign In</a>
					:
					<p className="mb-0" onClick={this.logout}>Logout, <span className="text-secondary">{this.props.user.username}</span></p>}
				</div>
			</div>
		)
	}
}

Navbar.propTypes = {
	user: PropTypes.object.isRequired,
	signOut: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    user: state.siteData.user,
});

export default connect(mapStateToProps, { signOut })(Navbar);