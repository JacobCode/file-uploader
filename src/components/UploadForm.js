import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import '../upload.css';

// https://file-upload-db.herokuapp.com
const API_URL = '';

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
		// If storage is more than 10MB (10000KB), prevent form submit and show error
		const storage = this.state.storage / 1024;
		const newFile = this.state.chosenFile.size / 1024;
		if (storage + newFile > 10000) {
			e.preventDefault();
			this.setState({ error: 'No room in your storage, make room by deleting files' });
			// Hide error after 3 seconds
			setTimeout(() => { this.setState({ error: null }) }, 3500);
		}
		// If file is more than 3000kb (3mb), prevent form from submit and show error
		if (newFile > 3000) {
			e.preventDefault();
			this.setState({ error: 'File is too big, please choose another'});
			// Hide error after 3 seconds
			setTimeout(() => { this.setState({ error: null }) }, 3500);
		}
	}
	render() {
		if (localStorage.user !== undefined) {
			const user = JSON.parse(localStorage.user);
			return (
				<div id="upload-form">
					{user.id !== null && user.email !== null && user.username !== null ?
					<div>
						<h2 style={{maxWidth: '600px', margin: '0 auto'}} className="mb-5 text-white">Add A File</h2>
						<form style={{maxWidth: '600px', margin: '0 auto'}} onSubmit={this.handleSubmit} action={`${API_URL}/upload`} method="POST" encType="multipart/form-data">
							<div className="mb-5 custom-file">
								{/* Only accept images */}
								<div className="form-group">
									<input name="file" onChange={this.handleFile} type="file" className="custom-file-input" required />
									<span id="custom-file-upload" style={{fontSize: '1.2rem'}} className="custom-file-label">{this.state.fileName}</span>
								</div>
							</div>
							<div className="form-group mb-5">
								<input style={{fontSize: '1.2rem'}} className="form-control text-muted" placeholder="File Name" name="name" type="text" required />
							</div>
							{/* Uploaded by user */}
							<input name="id" type="hidden" value={user._id} />
							<div className="form-group">
								<button style={{borderRadius: '50%', height: '65px', width: '65px'}} className="bg-primary d-flex align-items-center justify-content-center btn text-white mb-5" type="submit"><i style={{fontSize: '1.2rem'}} className="fas fa-plus"></i></button>
							</div>
						</form>
					</div> : null}
					{this.state.error !== null ?
					<div style={{maxWidth: '600px', position: 'fixed', bottom: '1.5rem', right: '1.5rem'}} className="m-0 alert alert-danger" role="alert">
						{this.state.error}
					</div> 
					: null}
				</div>
			)
		} else {
			return (
				<p style={{marginTop: '-2rem'}} className="text-white">Please <a href="/signin">sign in</a> to view your uploads</p>
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