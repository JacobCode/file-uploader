import React, { Component } from 'react';

export default class UploadForm extends Component {
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
	}
	render() {
		return (
			<div id="upload-form">
				<form onSubmit={this.handleSubmit} action="/upload" method="POST" encType="multipart/form-data">
					<div className="custom-file">
						<input accept="image/*" name="file" onChange={this.handleFile} type="file" className="custom-file-input" required />
						<label className="custom-file-label">{this.state.fileName}</label>
						<button className="btn btn-primary mt-4" type="submit">Upload</button>
					</div>
				</form>
			</div>
		)
	}
}