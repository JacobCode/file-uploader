import React, { Component } from 'react';

// Components
import UploadForm from '../components/UploadForm';
import UserUploads from '../components/UserUploads';

export default class Uploads extends Component {
	render() {
		return (
			<div id="uploads">
				<UserUploads />
				<UploadForm />
			</div>
		)
	}
}