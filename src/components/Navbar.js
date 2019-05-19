import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { signOut } from '../redux/actions/actions';

import '../navbar.css';

class Navbar extends Component {
	constructor() {
		super();
		this.logout = this.logout.bind(this);
	}
	logout() {
		this.props.signOut();
		localStorage.clear();
	}
	render() {
		return (
			<nav className="navbar navbar-dark justify-content-between" style={{marginBottom: '2rem'}}>
				<a href="/" className="navbar-brand">File Uploader</a>
				{/* Links on big screens */}
				<div className="d-flex links">
					<a className={`text-white nav-link ${window.location.pathname === '/edit' ? 'active' : ''}`} href="/edit">Edit</a>
					<a className={`text-white nav-link ${window.location.pathname === '/uploads' ? 'active' : ''}`} href="/uploads">Uploads</a>
					{this.props.user.username === null ? 
					<a className={`text-white nav-link ${window.location.pathname === '/signin' ? 'active' : ''}`} href="/signin">Sign In</a>
					:
					<a className={`text-white nav-link ${window.location.pathname === '/signin' ? 'active' : ''}`} href="/signin" onClick={this.logout}>Logout</a>}
				</div>
				{/* Dropdown on small screens */}
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarToggleExternalContent">
					<ul className="navbar-nav mr-auto">
					<li className={`nav-item ${window.location.pathname === '/edit' ? 'active' : ''}`}>
						<a className="nav-link" href="/edit">Edit</a>
					</li>
					<li className={`nav-item ${window.location.pathname === '/uploads' ? 'active' : ''}`}>
						<a className="nav-link" href="/uploads">Uploads</a>
					</li>
					<li className={`nav-item ${window.location.pathname === '/signin' ? 'active' : ''}`}>
						{this.props.user.username === null ? 
						<a className="nav-link" href="/signin">Sign In</a>
						:
						<a className="nav-link" href="/signin" onClick={this.logout}>Logout</a>}
					</li>
					</ul>
				</div>
			</nav>
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