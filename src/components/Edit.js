import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import '../edit.css';

import { signOut } from '../redux/actions/actions';

const API_URL = 'https://file-upload-db.herokuapp.com';

class Edit extends Component {
	constructor() {
		super();
		this.state = {
			oldPassword: '',
			newPassword: '',
			confirmPassword: '',
			error: '',
			message: '',
			deleteAccount: false,
			deletePassword: ''
		}
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleOld = this.handleOld.bind(this);
		this.handleNew = this.handleNew.bind(this);
		this.handleConfirm = this.handleConfirm.bind(this);
		this.handleCheckbox = this.handleCheckbox.bind(this);
		this.handleDeletePassword = this.handleDeletePassword.bind(this);
		this.deleteAccount = this.deleteAccount.bind(this);
	}
	handleOld(e) {
		this.setState({ oldPassword: e.target.value })
	}
	handleNew(e) {
		this.setState({ newPassword: e.target.value })
	}
	handleConfirm(e) {
		this.setState({ confirmPassword: e.target.value })
	}
	handlePasswordChange(e) {
		e.preventDefault();
		const info = {
			id: this.props.user._id,
			old: this.state.oldPassword,
			new: this.state.newPassword
		}
		// If user matches passwords
		if (this.state.newPassword === this.state.confirmPassword) {
			axios.post(`${API_URL}/user/changepassword`, info)
				.then((res) => {
					this.setState({ message: res.data, oldPassword: '', newPassword: '', confirmPassword: '' });
					setTimeout(() => { this.setState({ message: '' })}, 3500);
				})
				.catch((err) => console.log(err));
		} else {
			this.setState({ error: 'New passwords do not match' });
			setTimeout(() => { this.setState({ error: '' })}, 3500);
		}
	}
	handleCheckbox() {
		this.setState({ deleteAccount: !this.state.deleteAccount })
	}
	handleDeletePassword(e) {
		this.setState({ deletePassword: e.target.value })
	}
	deleteAccount(e) {
		e.preventDefault();
		axios.post(`${API_URL}/user/delete`, { id: this.props.user._id, password: this.state.deletePassword })
			.then((res) => {
				// If account was deleted, sign out
				this.props.signOut()
				localStorage.clear();
			})
			.then(() => window.location.pathname = '/signin')
			.catch((err) => {
				// If user is not found, show error
				if (err.response.status === 404) {
					this.setState({ oldPassword: '', error: err.response.data });
					setTimeout(() => { this.setState({ error: '' })}, 3500);
				}
			});
	}
	render() {
		if (localStorage.user !== undefined) {
			return (
				<div id="edit" className="d-flex justify-content-center">

					{/* Update Password */}
					<div className="edit-1">
						<h1 className="mb-5">Change Password</h1>
						<form onSubmit={this.handlePasswordChange}>
							<div className="form-group col p-0 mb-4">
								<label htmlFor="inputPassword" className="mb-3">Current Password</label>
								<input onChange={this.handleOld} value={this.state.oldPassword} type="password" className="form-control" id="inputPassword" placeholder="Password" required />
							</div>
							<div className="form-group col p-0 mb-4">
								<label htmlFor="inputNewPassword" className="mb-3">New Password</label>
								<input onChange={this.handleNew} value={this.state.newPassword} type="text" className="form-control" id="inputNewPassword" placeholder="Password" required />
							</div>
							<div className="form-group col p-0 mb-5">
								<label htmlFor="confirmPassword" className="mb-3">Confirm New Password</label>
								<input onChange={this.handleConfirm} value={this.state.confirmPassword} type="text" className="form-control" id="confirmPassword" placeholder="Password" required />
							</div>
							<button type="submit" className="btn btn-primary">Update Password</button>
						</form>
					</div>

					{/* Delete Account */}
					<div className="edit-2 mb-5">
						<h1 className="mb-5">Delete Account</h1>
						<form onSubmit={this.deleteAccount}>
							<div className="form-group col p-0 mb-4">
								<label htmlFor="deletePassword" className="mb-3">Password</label>
								<input onChange={this.handleDeletePassword} value={this.state.deletePassword} type="password" className="form-control" id="deletePassword" placeholder="Password" required />
							</div>
							<div className="form-check mb-5">
								<input checked={this.state.deleteAccount} onChange={this.handleCheckbox} type="checkbox" className="form-check-input" id="checkbox" required />
								<label className="form-check-label text-primary" htmlFor="checkbox">Are you sure you want to delete your account and files?</label>
							</div>
							<button type="submit" className="btn btn-danger">Delete account and files</button>
						</form>
					</div>

					{/* Change password error message */}
					{this.state.error.length > 0 ? 
					<div style={{maxWidth: '600px', position: 'fixed', bottom: '1.5rem', right: '1.5rem'}} className="alert alert-danger" role="alert">
						{this.state.error}
					</div> : null}

					{/* Change password success message */}
					{this.state.message.length > 0 ?
					<div style={{maxWidth: '600px', position: 'fixed', bottom: '1.5rem', right: '1.5rem'}} className="alert alert-success" role="alert">
						{this.state.message}
					</div> : null}

				</div>
			)
		} else {
			return (
				<p style={{marginTop: '-2rem'}} className="text-white">Please <a href="/signin">sign in</a> to edit your account</p>
			)
		}
	}
}

Edit.propTypes = {
	user: PropTypes.object.isRequired,
	signOut: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    user: state.siteData.user,
});

export default connect(mapStateToProps, { signOut })(Edit);