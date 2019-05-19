import React, { Component } from 'react';

import notFound from '../media/404.svg';

export default class Error extends Component {
	render() {
		return (
			<div className="d-flex flex-column align-items-center justify-content-center">
				<img className="mw-100 mb-5" src={notFound} alt="Page Not Found" />
				<h1>Page Not Found. <a href="/uploads">Uploads</a></h1>
			</div>
		)
	}
}