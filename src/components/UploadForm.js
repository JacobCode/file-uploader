import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loginUser } from '../redux/actions/actions';

class UploadForm extends Component {
	constructor() {
		super();
		this.state = {
			chosenFile: null,
			fileName: 'Choose File...'
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleFile = this.handleFile.bind(this);
	}
	handleFile(e) {
		const file = e.target.files[0];
		this.setState({ chosenFile: file, fileName: file.name })
	}
	handleSubmit(e) {
		console.log(e);
	}
	componentWillMount() {
		if (localStorage.user !== undefined) {
			console.log(JSON.parse(localStorage.user));
		}
	}
	render() {
		if (localStorage.user !== undefined) {
			const user = JSON.parse(localStorage.user);
			return (
				<div id="upload-form">
					{user.id !== null && user.email !== null && user.username !== null ?
					<form onSubmit={this.handleSubmit} action="/upload" method="POST" encType="multipart/form-data">
						<div className="custom-file">
							{/* <input accept="image/*" name="file" onChange={this.handleFile} type="file" className="custom-file-input" required /> */}
							<input name="file" onChange={this.handleFile} type="file" className="custom-file-input" required />
							<label className="custom-file-label">{this.state.fileName}</label>
							{/* Uploaded by user */}
							<input name="id" type="hidden" value={user._id} />
							<button className="btn btn-primary mt-4" type="submit">Upload</button>
						</div>
					</form> : 'Please Login'}
				</div>
			)
		} else {
			return (
				<p>Please <a href="/signin">sign in</a> to view your uploads</p>
			)
		}
	}
}

UploadForm.propTypes = {
    user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    user: state.siteData.user,
});

export default connect(mapStateToProps, { loginUser })(UploadForm);