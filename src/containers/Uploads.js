import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getUserFiles } from '../redux/actions/actions';

// Components
import UploadForm from '../components/UploadForm';
import UserUploads from '../components/UserUploads';

class Uploads extends Component {
	componentWillMount() {
		if (this.props.user._id !== null) {
			this.props.getUserFiles(this.props.user._id);
		}
	}
	render() {
		return (
			<div id="uploads" style={{minWidth: '100%'}}>
				<UserUploads totalFiles={this.props.userFiles} />
				<UploadForm />
			</div>
		)
	}
}

Uploads.propTypes = {
	user: PropTypes.object.isRequired,
	getUserFiles: PropTypes.func.isRequired,
	userFiles: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
	user: state.siteData.user,
	userFiles: state.siteData.userFiles
});

export default connect(mapStateToProps, { getUserFiles })(Uploads);