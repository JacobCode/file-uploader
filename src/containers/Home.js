import React, { Component } from 'react';

import '../css/home.css';

// Images
import cloud from '../media/cloud.svg';
import files from '../media/files.svg';

import Pricing from '../components/Pricing';

export default class Home extends Component {
	render() {
		return (
			<div id="home">
				{/* Welcome */}
				<section id="welcome" className="mb-6 container">
					<div className="text">
						<h1>Welcome To File Uploader</h1>
						<p>Start uploading images, audio, and other files and be able to access them on other devices</p>
						<a href="/signin" className="btn btn-primary text-white">Start Now</a>
					</div>
					<div className="d-flex align-items-center justify-content-center">
						<img src={files} alt="Start Uploading Files" />
					</div>
				</section>
				{/* Storage */}
				<section id="storage" className="d-flex mb-6 container">
					<div className="d-flex flex-column justify-content-center">
						<h1 className="mb-5">Cloud Storage</h1>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque id arcu vitae tortor auctor interdum eu 
						eu diam. Suspendisse placerat cursus dolor, vitae scelerisque justo eleifend ut. Suspendisse non est mauris. Pellentesque 
						facilisis elementum vehicula. Etiam pretium euismod eleifend. Curabitur ac dui eros.</p>
					</div>
					<div className="d-flex align-items-center justify-content-center">
						<img src={cloud} alt="Cloud" />
					</div>
				</section>
				{/* Pricing */}
				<Pricing />
				{/* Footer */}
				<footer>
					<div className="grid">

						<div className="col">
						<h6>File Uploader</h6>
							<p>Copyright 2019 &copy;</p>
						</div>
						<div className="col">
							<h6>Customers</h6>
							<ul>
								<li>Buyer</li>
								<li>Supplier</li>
							</ul>
						</div>
						<div className="col">
							<h6>Company</h6>
							<ul>
								<li>About Us</li>
								<li>Careers</li>
								<li>Contact Us</li>
							</ul>
						</div>
						<div className="col">
							<h6>Info</h6>
							<ul>
								<li>Terms & Conditions</li>
								<li>Privacy Policy</li>
							</ul>
						</div>
						<div className="col">
							<h6>Follow Us</h6>
							<div className="socials">
								<i className="fab fa-facebook-f"></i>
								<i className="fab fa-medium-m"></i>
								<i className="fab fa-dribbble"></i>
								<i className="fab fa-twitter"></i>
								<i className="fab fa-google-plus-g"></i>
							</div>
						</div>
					</div>
				</footer>
			</div>
		)
	}
}