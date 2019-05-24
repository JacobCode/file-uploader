import React, { Component } from 'react';

import '../home.css';

import cloud from '../media/cloud.svg';

import Pricing from '../components/Pricing';

export default class Home extends Component {
	render() {
		return (
			<div id="home">
				<div id="storage" className="d-flex mb-6">
					<div className="d-flex flex-column justify-content-center">
						<h1 className="mb-5">Cloud Storage</h1>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id arcu vitae tortor auctor interdum eu 
						eu diam. Suspendisse placerat cursus dolor, vitae scelerisque justo eleifend ut. Suspendisse non est mauris. Pellentesque 
						facilisis elementum vehicula. Etiam pretium euismod eleifend. Curabitur ac dui eros.</p>
					</div>
					<div className="d-flex align-items-center justify-content-center">
						<img src={cloud} alt="Cloud" />
					</div>
				</div>
				<Pricing />
			</div>
		)
	}
}