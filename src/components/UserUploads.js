import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

import { loginUser } from '../redux/actions/actions';

import noFiles from '../media/empty.svg';
import '../user-uploads.css';

const API_URL = 'https://file-upload-db.herokuapp.com';

class UserUploads extends Component {
	constructor() {
		super();
		this.state = {
			userFiles: [],
			activeImage: '',
			chosenFile: '',
			storage: 0,
			nums: [],
			downloadLink: '',
			storagePercent: '',
			downloadName: ''
		}
		this.getUserFiles = this.getUserFiles.bind(this);
		this.showFile = this.showFile.bind(this);
	}
	getUserFiles() {
		axios.get(`${API_URL}/user/files/${this.props.user._id}`)
			.then((res) => {
				this.setState({ userFiles: res.data });
				const numbers = [];
				if (res.data.length >= 1) {
					res.data.forEach(file => {
						numbers.push(file.length)
					});
					const getSum = (total, num) => {
						return total + num;
					}
					this.setState({
						storage: this.convertBytes(numbers.reduce(getSum), 2),
						storagePercent: (((numbers.reduce(getSum) / 1024) / 10000) * 100).toFixed(3)
					});
				}
			})
			.catch((err) => console.log('Error getting files, please try again later'));
	}
	// Convert bytes
	convertBytes(bytes, num) {
		var i = Math.floor(Math.log(bytes) / Math.log(1024)),
			sizes = [' B', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];

		return (bytes / Math.pow(1024, i)).toFixed(num) * 1 + '' + sizes[i];
	}
	// Show image/file info
	showFile(e, file) {
		if (file._id) {
			// Get file by ID and display image
		}
	}
	// Delete file by id
	deleteFile(e, file) {
		if (file._id) {
			axios.get(`${API_URL}/files/delete/${file._id}/${this.props.user._id}`)
				.then((res) => {
					this.setState({ userFiles: this.state.userFiles.filter((f) => f._id !== file._id) })
				});
		}
	}
	// Download file by filename
	downloadFile(e, file) {
		if (this.state.downloadLink.length > 0) {
			this.setState({ downloadLink: '', downloadName: '' });
			setTimeout(() => {
				this.setState({ downloadLink: `${API_URL}/files/download/${file.filename}/`, downloadName: file.metadata.customName })
			}, 1000);
		} else {
			this.setState({ downloadLink: `${API_URL}/files/download/${file.filename}/`, downloadName: file.metadata.customName });
			setTimeout(() => {
				this.setState({ downloadLink: '', downloadName: '' })
			}, 5000);
		}
	}
	componentWillMount() {
		// If logged in, get users files
		if (this.props.user._id !== null) {
			this.getUserFiles();
		}
	}
	render() {
		if (this.props.user._id !== null) {
			return (
				<div id="user-uploads">
					{this.state.userFiles.length > 0 ?
					<div className="uploads">
						{/* Header and storage info */}
						<header className="mb-5 d-flex justify-content-between align-items-center">
							<h2>Your Files</h2>
							<div className="d-flex flex-column">
								<div className="mb-2" style={{color: '#e6e6e6'}}>
									{this.state.storage} / 10 MB
								</div>
								<div className="progress" style={{height:'8px'}}>
									<div className="progress-bar bg-primary" style={{width:`${this.state.storagePercent}%`}}></div>
								</div>
							</div>
						</header>
						{/* File info titles */}
						<div className="titles w-100 d-flex justify-content-between mb-3 text-muted">
							<p style={{width: '55%'}} className="text-left">Name:</p>
							<p style={{width: '20%'}} className="text-left">Size:</p>
							<p style={{width: '20%'}} className="text-left pl-3">Type:</p>
							<p style={{width: '5%'}}></p>
						</div>
						{/* User's files */}
						<div className="files d-flex flex-column">
							{this.state.userFiles.map((file) => {
								return (
									<div className="file w-100 d-flex justify-content-between mb-4" key={file._id}>
										<p onClick={e => this.downloadFile(e, file)} style={{width: '55%'}} className="show-file">
											<button type="button" className="btn btn-white p-0 text-primary d-flex align-items-center text-left" data-toggle="modal" data-target="#exampleModal">{file.metadata.customName}</button>
										</p>
										<p style={{width: '20%'}} className="file-size d-flex align-items-center text-left">{this.convertBytes(file.length, 1)}</p>
										{/* Show different file icons depending on the file contentType */}
										<p style={{width: '20%', fontSize: '1.4rem'}} className="file-type pl-3 d-flex align-items-center text-left">
											{/* Load different file types */}
											{file.contentType === 'image/png' ? <i className="fas fa-file-image"></i>
											: 
											file.contentType === 'image/svg+xml' ? <i className="fas fa-file-alt"></i>
											:
											file.contentType === 'image/jpeg' ? <i className="fas fa-file-image"></i>
											: file.contentType === 'audio/mpeg' ? <i className="fas fa-file-audio"></i>
											: <i className="fas fa-file"></i>}
										</p>
										<p onClick={e => this.deleteFile(e, file)} className="d-flex align-items-center" style={{width: '5%'}}><i className="far fa-trash-alt text-right" style={{fontSize: '1.25rem'}}></i></p>
									</div>
								)
							})}
						</div>
						{this.state.downloadLink.length > 0 ? <a download={this.state.downloadName} href={this.state.downloadLink} className="btn btn-primary">Download File</a> : null}
					</div>
					: null }
					{this.state.userFiles.length === 0 && this.props.user.username !== null ?
					<div className="mb-5 d-flex justify-content-center align-items-center">
						<img src={noFiles} style={{width: '90%', maxWidth: '900px', maxHeight: '450px'}} alt="No Files Found" />
					</div> : null}

					{/* Load different image types */}
					{/* {this.state.chosenFile.contentType === 'image/png' ? <img className="d-flex mw-100" src={`data:image/pdf;base64,${this.state.activeImage}`} alt='null' />
					: 
					this.state.chosenFile.contentType === 'image/svg+xml' ? <img className="d-flex mw-100" src={`data:image/svg+xml;base64,${this.state.activeImage}`} alt='null' />
					:
					this.state.chosenFile.contentType === 'image/jpeg' ? <img className="d-flex mw-100" src={`data:image/jpeg;base64,${this.state.activeImage}`} alt='null' />
					: null} */}
				</div>
			)
		} else {
			return (
				<div></div>
			)
		}
	}
}

UserUploads.propTypes = {
	user: PropTypes.object.isRequired,
	loginUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    user: state.siteData.user,
});

export default connect(mapStateToProps, { loginUser })(UserUploads);