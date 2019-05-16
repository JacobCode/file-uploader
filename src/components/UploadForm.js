import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const API_URL = 'https://file-upload-db.herokuapp.com';

class UploadForm extends Component {
	constructor() {
		super();
		this.state = {
			chosenFile: null,
			fileName: 'Choose File...',
			storage: 0,
			error: null
		}
		this.handleFile = this.handleFile.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleFile(e) {
		if (this.props.user.username === null) {
			e.preventDefault();
		}
		const file = e.target.files[0];
		this.setState({ chosenFile: file, fileName: file.name });
	}
	componentWillMount() {
		const numbers = [];
		if (this.props.user.files.length >= 1) {
			JSON.parse(localStorage.user).files.forEach(file => {
				numbers.push(file.length)
			});
			const getSum = (total, num) => {
				return total + num;
			}
			this.setState({ storage: numbers.reduce(getSum) });
		}
	}
	handleSubmit(e) {
		// If storage is more than 25MB (25000KB), prevent form submit and show error
		const storage = this.state.storage / 1024;
		const newFile = this.state.chosenFile.size / 1024;
		if (storage + newFile > 25000) {
			e.preventDefault();
			this.setState({ error: 'No room in your storage, make room by deleting files' });
			// Hide error after 3 seconds
			setTimeout(() => { this.setState({ error: null }) }, 3500)
		}
	}
	render() {
		if (localStorage.user !== undefined) {
			const user = JSON.parse(localStorage.user);
			return (
				<div id="upload-form">
					{user.id !== null && user.email !== null && user.username !== null ?
					<form onSubmit={this.handleSubmit} action={`${API_URL}/upload`} method="POST" encType="multipart/form-data">
						<div className="mb-5 custom-file">
							{/* Only accept images */}
							<input accept="image/*" name="file" onChange={this.handleFile} type="file" className="custom-file-input" required />
							<label className="custom-file-label">{this.state.fileName}</label>
							{/* Uploaded by user */}
							<input name="id" type="hidden" value={user._id} />
						</div>
						<button className="btn btn-primary mb-5" type="submit">Upload</button>
					</form> : null}
					{this.state.error !== null ?
					<div className="alert alert-danger" role="alert">
						{this.state.error}
					</div> 
					: null}
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

export default connect(mapStateToProps)(UploadForm);