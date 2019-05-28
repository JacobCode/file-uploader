import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { deleteFile } from '../redux/actions/actions'

import noFiles from '../media/empty.svg';
import '../css/user-uploads.css';

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
		this.updateStorage = this.updateStorage.bind(this);
		this.deleteFile = this.deleteFile.bind(this);
		this.downloadFile = this.downloadFile.bind(this);
	}
	// Convert bytes
	convertBytes(bytes, num) {
		var i = Math.floor(Math.log(bytes) / Math.log(1024)),
			sizes = [' B', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];

		return (bytes / Math.pow(1024, i)).toFixed(num) * 1 + '' + sizes[i];
	}
	// Delete file by id
	deleteFile(e, file) {
		if (file._id) {
			this.props.deleteFile(file._id, this.props.user._id, this.props.userFiles);
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
		}
	}
	updateStorage(totalFiles) {
		if (totalFiles.length >= 1) {
			const numbers = [];
			totalFiles.forEach(file => {
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
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.totalFiles.length >= 1) {
			this.updateStorage(nextProps.totalFiles);
		}
	}
	render() {
		if (this.props.user._id !== null) {
			return (
				<div id="user-uploads" className="mb-6 mt-6 container">
					{this.props.userFiles.length > 0 ? 
					<header className="mb-5 d-flex justify-content-between align-items-center">
						<h2>Your Files</h2>
						<div className="d-flex flex-column">
							<div className="mb-2" style={{color: '#e6e6e6'}}>
								{this.props.userFiles.length > 0 ? this.state.storage : '0'} / 10 MB
							</div>
							<div className="progress" style={{minWidth: '100px', height:'8px'}}>
								<div className="progress-bar bg-primary" style={{width:`${this.state.storagePercent}%`}}></div>
							</div>
						</div>
					</header>
					: null}
					{this.props.userFiles.length > 0 ?
					<div className="uploads">
						{/* User's files */}
						<div className="files d-flex flex-column">
							{this.props.userFiles.map((file) => {
								return (
									<div className="file w-100 d-flex justify-content-between mb-4" key={file._id}>
										<p onClick={e => this.downloadFile(e, file)} style={{width: '55%'}} className="show-file">
											<button type="button" className="btn btn-white p-0 text-primary d-flex align-items-center text-left" data-toggle="modal" data-target="#exampleModal">{file.metadata.name}</button>
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
											: file.contentType === 'application/pdf' ? <i className="fas fa-file-pdf"></i>
											: <i className="fas fa-file"></i>}
										</p>
										<p onClick={e => this.deleteFile(e, file)} className="d-flex align-items-center" style={{width: '5%'}}><i className="far fa-trash-alt text-right" style={{fontSize: '1.25rem'}}></i></p>
									</div>
								)
							})}
						</div>
						{this.state.downloadLink.length > 0 ?
						<div className="d-flex align-items-center mb-5">
							<a download={this.state.downloadName} href={this.state.downloadLink} className="btn btn-primary">Download File</a>
							<span className="ml-3 text-white" style={{opacity: 0.6}}>{this.state.downloadName}</span>
						</div> : null}
					</div>
					: null }
					{this.props.userFiles.length === 0 && this.props.user.username !== null ?
					<div className="mb-5 d-flex justify-content-center align-items-center">
						<img src={noFiles} style={{width: '90%', maxWidth: '900px', maxHeight: '450px'}} alt="No Files Found" />
					</div> : null}
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
	userFiles: PropTypes.array.isRequired,
	deleteFile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	user: state.siteData.user,
	userFiles: state.siteData.userFiles
});

export default connect(mapStateToProps, { deleteFile })(UserUploads);