import React, { Component } from 'react';

export default class Pricing extends Component {
	constructor() {
		super();
		this.state = {
			initialPlan: false
		}
		this.changePlan = this.changePlan.bind(this);
	}
	changePlan(e, bool) {
		if (bool !== this.state.initialPlan) {
			this.setState({
				initialPlan: !this.state.initialPlan
			});
		}
	}
	render() {
		return (
			<div id="pricing" className="mb-6">
				<header className="text-center mb-5">
					<h1>Upgrade your plan to unlock extra features</h1>
				</header>
				<div onClick={e => this.changePlan(e, false)} className="plans d-flex">
					<div className={`plan plan-2 ${this.state.initialPlan === false ? 'active' : null}`}>
						<h3 className="mb-4">Free Account</h3>
						<span>$0 / mo.</span>
						<p>Suspendisse placerat cursus dolor vitae</p>
						<hr />
						<ul>
							<li>- 10 MB Storage</li>
							<li>- Image & Text Files</li>
							<li>- Share Between Devices</li>
							<li>- Edit Account Information</li>
						</ul>
						<hr className="mb-4" />
						<button className="btn btn-primary">Create Free Account</button>
					</div>
					<div onClick={e => this.changePlan(e, true)} className={`plan plan-2 ${this.state.initialPlan === true ? 'active' : null}`}>
						<h3 className="mb-4">Pro Account</h3>
						<span>$250 / mo.</span>
						<p>Suspendisse placerat cursus dolor vitae</p>
						<hr />
						<ul>
							<li>- 1 GB Storage</li>
							<li>- Image, Audio, Video, & Text Files</li>
							<li>- Share Between Devices</li>
							<li>- Backup Your Files</li>
						</ul>
						<hr className="mb-4" />
						<button className="btn btn-primary">Contact Us</button>
					</div>
				</div>
			</div>
		)
	}
}