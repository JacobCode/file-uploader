import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

class UserUploads extends Component {
	constructor() {
		super();
		this.state = {
			userFiles: []
		}
		this.getUserFiles = this.getUserFiles.bind(this);
	}
	getUserFiles() {
		axios.get(`/user/files/${this.props.user._id}`)
			.then((res) => this.setState({ userFiles: res.data }))
			.catch((err) => console.log(err));
	}
	componentWillMount() {
		if (this.props.user) {
			this.getUserFiles();
		}
	}
	convertBytes(bytes) {
		var i = Math.floor(Math.log(bytes) / Math.log(1024)),
			sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

		return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i];
	}
	render() {
		return (
			<div id="user-uploads">
				{this.state.userFiles.length > 0 ?
				<div className="uploads">
					<h2 className="mb-5 text-warning">Your Files</h2>
					<div className="w-100 d-flex justify-content-between mb-3 text-muted">
						<p style={{width: '60%'}} className="text-left">Name:</p>
						<p style={{width: '15%'}} className="text-right">Size:</p>
						<p style={{width: '25%'}} className="text-right">Type:</p>
					</div>
					<div className="files d-flex flex-column">
						{this.state.userFiles.map((file) => {
							console.log(file);
							return (
								<div className="w-100 d-flex justify-content-between mb-4 border-bottom border-muted" key={file._id}>
									<p style={{width: '50%'}} className="text-left">{file.metadata.name}</p>
									<p style={{width: '25%'}} className="text-right">{this.convertBytes(file.length)}</p>
									<p style={{width: '25%'}} className="text-right">{file.contentType}</p>
								</div>
							)
						})}
					</div>
				</div>
				: null }
				{this.state.userFiles.length === 0 && this.props.user.username !== null ? 'No Files Found' : null}
			</div>
		)
	}
}

UserUploads.propTypes = {
    user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    user: state.siteData.user,
});

export default connect(mapStateToProps)(UserUploads);