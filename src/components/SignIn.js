import React, { Component } from 'react';
import axios from 'axios';

export default class SignIn extends Component {
	constructor() {
		super();
		this.state = {
			lusername: '',
			lpassword: '',
			remail: '',
			rusername: '',
			rpassword: '',
		}
		this.handleInput = this.handleInput.bind(this);
		this.loginSubmit = this.loginSubmit.bind(this);
		this.registerSubmit = this.registerSubmit.bind(this);
	}
	handleInput(e) {
		this.setState({ [e.target.id]: e.target.value });
	}
	loginSubmit(e) {
		e.preventDefault();
		const login = {
			username: this.state.lusername,
			password: this.state.lpassword
		}
		axios.post('/login', login).then((res) => console.log(res))
	}
	registerSubmit(e) {
		e.preventDefault();
		const newUser = {
			email: this.state.remail,
			username: this.state.rusername,
			password: this.state.rpassword
		}
		axios.post('/register', newUser).then((res) => console.log(res))
	}
	render() {
		return (
			<div id="signin">

				{/* Login */}
				<form onSubmit={this.loginSubmit} className="form mb-5">
					<h1 className="mb-4 text-primary">Login</h1>
					<div className="form-group">
						<label htmlFor="lusername" className="mb-2 text-primary">Username</label><br/>
						<input onChange={this.handleInput} type="text" name="lusername" id="lusername" className="form-control" />
					</div>
					<div className="form-group">
						<label htmlFor="lpassword" className="mb-2 text-primary">Password</label><br/>
						<input onChange={this.handleInput} type="text" name="lpassword" id="lpassword" className="form-control" />
					</div>
					<div className="form-group">
						<button type="submit" name="lsubmit" className="btn btn-primary btn-md">Sign In</button>
					</div>
					<div className="text-right">
						<a href="/signin" className="text-primary">Register</a>
					</div>
				</form>

				{/* Register */}
				<form onSubmit={this.registerSubmit} className="form">
					<h1 className="mb-4 text-danger">Register</h1>
					<div className="form-group">
						<label htmlFor="remail" className="mb-2 text-danger">Email</label><br/>
						<input onChange={this.handleInput} type="email" name="remail" id="remail" className="form-control" />
					</div>
					<div className="form-group">
						<label htmlFor="rusername" className="mb-2 text-danger">Username</label><br/>
						<input onChange={this.handleInput} type="text" name="rusername" id="rusername" className="form-control" />
					</div>
					<div className="form-group">
						<label htmlFor="rassword" className="mb-2 text-danger">Password</label><br/>
						<input onChange={this.handleInput} type="password" name="rpassword" id="rpassword" className="form-control" />
					</div>
					<div className="form-group">
						<button type="submit" name="rsubmit" className="btn btn-danger btn-md">Sign Up</button>
					</div>
					<div className="text-right">
						<a href="/signin" className="text-danger">Login</a>
					</div>
				</form>

			</div>
		)
	}
}