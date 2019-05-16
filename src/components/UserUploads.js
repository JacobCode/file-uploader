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
			storagePercent: ''
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
						storage: this.convertBytes(numbers.reduce(getSum)),
						storagePercent: (((numbers.reduce(getSum) / 1024) / 25000) * 100).toFixed(2)
					});
				}
			})
			.catch((err) => console.log('Error getting files, please try again later'));
	}
	// Convert bytes
	convertBytes(bytes) {
		var i = Math.floor(Math.log(bytes) / Math.log(1024)),
			sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

		return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + '' + sizes[i];
	}
	// Show image/file info
	showFile(e, file) {
		if (file._id) {
			axios.get(`${API_URL}/files/${file.filename}`)
				.then((res) => {
					this.setState({ chosenFile: file, activeImage: res.data.data })
				});
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
		this.setState({ downloadLink: `${API_URL}/files/download/${file.filename}/` });
	}
	componentWillMount() {
		// If logged in, get users files
		if (this.props.user._id !== null) {
			this.getUserFiles();
		}
	}
	render() {
		return (
			<div id="user-uploads" className="mb-5">
				{this.state.userFiles.length > 0 ?
				<div className="uploads">
					<header className="mb-5 d-flex justify-content-between align-items-center text-warning">
						<h2>Your Files</h2>
						<div className="d-flex flex-column">
							<div className="mb-2">
								{this.state.storage} / 25MB
							</div>
							<div className="progress" style={{height:'8px'}}>
								<div className="progress-bar bg-primary" style={{width:`${this.state.storagePercent}%`}}></div>
							</div>
						</div>
					</header>
					<div className="titles w-100 d-flex justify-content-between mb-3 text-muted">
						<p style={{width: '50%'}} className="text-left">Name:</p>
						<p style={{width: '15%'}} className="text-left">Size:</p>
						<p style={{width: '30%'}} className="text-left pl-3">Type:</p>
						<p style={{width: '5%'}}></p>
					</div>
					<div className="files d-flex flex-column">
						{this.state.userFiles.map((file) => {
							return (
								<div className="file w-100 d-flex justify-content-between mb-4 border-bottom border-muted" key={file._id}>
									<p onClick={e => this.showFile(e, file)} style={{width: '50%'}} className="text-left">{file.metadata.name}</p>
									<p style={{width: '15%'}} className="d-flex align-items-center text-left">{this.convertBytes(file.length)}</p>
									<p onClick={e => this.downloadFile(e, file)} style={{width: '30%', fontSize: '1.5rem'}} className="pl-3 d-flex align-items-center text-left"><i className="fas fa-file-pdf"></i></p>
									<p onClick={e => this.deleteFile(e, file)} className="d-flex align-items-center" style={{width: '5%'}}><i className="far fa-trash-alt text-right" style={{fontSize: '1.25rem'}}></i></p>
								</div>
							)
						})}
					</div>
					{this.state.downloadLink.length > 0 ? <a download="download" href={this.state.downloadLink} className="btn btn-primary">Download File</a> : null}
				</div>
				: null }
				{this.state.userFiles.length === 0 && this.props.user.username !== null ?
				<div className="mb-5 d-flex justify-content-center align-items-center">
					<img src={noFiles} style={{maxWidth: '300px'}} alt="No Files Found" />
				</div> : null}

				{/* Load different image types */}
				{this.state.chosenFile.contentType === 'image/png' ? <img className="d-flex mw-100" src={`data:image/pdf;base64,${this.state.activeImage}`} alt='null' />
				: 
				this.state.chosenFile.contentType === 'image/svg+xml' ? <img className="d-flex mw-100" src={`data:image/svg+xml;base64,${this.state.activeImage}`} alt='null' />
				:
				this.state.chosenFile.contentType === 'image/jpeg' ? <img className="d-flex mw-100" src={`data:image/jpeg;base64,${this.state.activeImage}`} alt='null' />
				: null}
			</div>
		)
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