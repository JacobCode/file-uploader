import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

import { loginUser } from '../redux/actions/actions';

const API_URL = '';

class UserUploads extends Component {
	constructor() {
		super();
		this.state = {
			userFiles: [],
			activeImage: '',
			chosenFile: '',
			storage: 0,
			nums: []
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
					this.setState({ storage: this.convertBytes(numbers.reduce(getSum)) });
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
				.then((res) => console.log(res.data));
		}
	}
	componentWillMount() {
		// If logged in, get users files
		if (this.props.user._id !== null) {
			this.getUserFiles();
		}
	}
	render() {
		return (
			<div id="user-uploads">
				{this.state.userFiles.length > 0 ?
				<div className="uploads">
					<div className="mb-5 d-flex justify-content-between align-items-center text-warning"><h2>Your Files</h2><span>{this.state.storage} / 25MB</span></div>
					<div className="w-100 d-flex justify-content-between mb-3 text-muted">
						<p style={{width: '50%'}} className="text-left">Name:</p>
						<p style={{width: '15%'}} className="text-right">Size:</p>
						<p style={{width: '35%'}} className="text-right">Type:</p>
					</div>
					<div className="files d-flex flex-column">
						{this.state.userFiles.map((file) => {
							return (
								<div className="w-100 d-flex justify-content-between mb-4 border-bottom border-muted" key={file._id}>
									<p onClick={e => this.showFile(e, file)} style={{width: '50%'}} className="text-left">{file.metadata.name}</p>
									<p onClick={e => this.deleteFile(e, file)} style={{width: '15%'}} className="text-right">{this.convertBytes(file.length)}</p>
									<p style={{width: '35%'}} className="text-right">{file.contentType}</p>
								</div>
							)
						})}
					</div>
				</div>
				: null }
				{this.state.userFiles.length === 0 && this.props.user.username !== null ? 'No Files Found' : null}

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