import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import '../edit.css';

const API_URL = '';

class Edit extends Component {
	constructor() {
		super();
		this.state = {
			oldPassword: '',
			newPassword: '',
			confirmPassword: '',
			error: '',
			message: ''
		}
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleOld = this.handleOld.bind(this);
		this.handleNew = this.handleNew.bind(this);
		this.handleConfirm = this.handleConfirm.bind(this);
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
			email: this.props.user.email,
			old: this.state.oldPassword,
			new: this.state.newPassword
		}
		if (this.state.newPassword === this.state.confirmPassword) {
			axios.post(`${API_URL}/changepassword`, info)
				.then((res) => {
					this.setState({ message: res.data, oldPassword: '', newPassword: '', confirmPassword: '' });
					setTimeout(() => { this.setState({ error: '' })}, 3500);
				})
				.catch((err) => {
					if (err.response.status === 404) {
						this.setState({ oldPassword: '', error: err.response.data });
						setTimeout(() => { this.setState({ error: '' })}, 3500);
					}
				});
		} else {
			this.setState({ error: 'New passwords do not match' });
			setTimeout(() => { this.setState({ error: '' })}, 3500);
		}
	}
	render() {
		if (localStorage.user !== undefined) {
			const user = JSON.parse(localStorage.user);
			return (
				<div id="edit">
					<h1 className="mb-5">Edit Page</h1>
					<form onSubmit={this.handlePasswordChange}>
						<div className="form-group col p-0 mb-4">
							<label htmlFor="staticEmail" className="mb-3">Email</label>
							<input type="text" readOnly className="form-control" id="staticEmail" value={user.email} required />
						</div>
						<div className="form-group col p-0 mb-4">
							<label htmlFor="inputPassword" className="mb-3">Current Password</label>
							<input onChange={this.handleOld} value={this.state.oldPassword} type="password" className="form-control" id="inputPassword" placeholder="Password" required />
						</div>
						<div className="form-group col p-0 mb-4">
							<label htmlFor="inputNewPassword" className="mb-3">New Password</label>
							<input onChange={this.handleNew} value={this.state.newPassword} type="text" className="form-control" id="inputNewPassword" placeholder="Password" required />
						</div>
						<div className="form-group col p-0 mb-6">
							<label htmlFor="confirmPassword" className="mb-3">Confirm New Password</label>
							<input onChange={this.handleConfirm} value={this.state.confirmPassword} type="text" className="form-control" id="confirmPassword" placeholder="Password" required />
						</div>
						<button type="submit" className="btn btn-primary">Update Password</button>
					</form>
					{this.state.error.length > 0 ? 
					<div className="alert alert-danger" role="alert">
						{this.state.error}
					</div> : null}
					{/* Register Success Alert */}
					{this.state.message.length > 0 ?
					<div className="alert alert-success" role="alert">
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
	user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    user: state.siteData.user,
});

export default connect(mapStateToProps)(Edit);