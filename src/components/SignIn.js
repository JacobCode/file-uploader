import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loginUser, signOut } from '../redux/actions/actions';

class SignIn extends Component {
	constructor() {
		super();
		this.state = {
			lusername: '',
			lpassword: '',
			remail: '',
			rusername: '',
			rpassword: '',
			showLogin: true,
			id: '',
			user: {},
			error: ''
		}
		this.handleInput = this.handleInput.bind(this);
		this.loginSubmit = this.loginSubmit.bind(this);
		this.registerSubmit = this.registerSubmit.bind(this);
		this.changeForm = this.changeForm.bind(this);
		this.logout = this.logout.bind(this);
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
		axios.post('/login', login).then((res) => {
			if(res.data.username !== undefined) {
				this.props.loginUser(res.data);
				this.setState({ lusername: '', lpassword: '', user: res.data });
				setTimeout(() => {
					window.location.pathname = '/uploads';
				}, 500);
			} else {
				this.setState({ error: res.data })
				setTimeout(() => {
					this.setState({ error: '' })
				}, 3500)
			}
			localStorage.setItem('user', JSON.stringify(this.props.user));
		}).catch((err) => this.setState({ error: 'Too many attempts, please try again later' }))
	}
	registerSubmit(e) {
		e.preventDefault();
		const newUser = {
			email: this.state.remail,
			username: this.state.rusername,
			password: this.state.rpassword
		}
		axios.post('/register', newUser).then((res) => {
			if (res.status === 200) {
				this.setState({ remail: '', rusername: '', rpassword: '' });
				setTimeout(() => {
					window.location.pathname = '/signin';
				}, 1000);
			}
			if (res.status === 201) {
				this.setState({ error: res.data });
				setTimeout(() => { this.setState({ error: '' })}, 2000);
			}
		}).catch((err) => {
			this.setState({ error: 'Too many attempts, please try again later' });
			setTimeout(() => { this.setState({ error: '' })}, 2000);
		});
	}
	changeForm() {
		this.setState({ showLogin: !this.state.showLogin, lusername: '', lpassword: '', remail: '', rusername: '', rpassword: '' })
	}
	logout() {
		this.props.signOut();
		localStorage.clear();
	}
	render() {
		const { user } = this.props;
		return (
			<div id="signin">

				{/* Show Login form if not logged in */}
				{this.state.showLogin === true && user.username === null ? 
				<form onSubmit={this.loginSubmit} className="form mb-5">
					{/* Login Form */}
					<h1 className="mb-4 text-warning">Login</h1>
					<div className="input-group mb-4">
						<div className="input-group-prepend">
							<span className="input-group-text"><i className="fas fa-user"></i></span>
						</div>
						<input onChange={this.handleInput} value={this.state.lusername} type="text" name="lusername" id="lusername" className="form-control" placeholder="Username" aria-label="Username" />
					</div>

					<div className="input-group mb-4">
						<div className="input-group-prepend">
							<span className="input-group-text"><i className="fas fa-key"></i></span>
						</div>
						<input onChange={this.handleInput} value={this.state.lpassword} type="password" name="lpassword" id="lpassword" className="form-control" placeholder="Password" aria-label="Password" />
					</div>

					<div className="form-group">
						<button type="submit" name="lsubmit" className="btn btn-warning btn-md text-white">Sign In</button>
					</div>
					<div className="text-right">
						<span onClick={this.changeForm} href="/signin" className="text-primary">Register</span>
					</div>
				</form>
				: null }

				{/* ShowRegister form if not logged in */}
				{this.state.showLogin === false && user.username === null ?
				<form onSubmit={this.registerSubmit} className="form mb-5">
					{/* Register Form */}
					<h1 className="mb-4 text-warning">Register</h1>

					<div className="input-group mb-4">
						<div className="input-group-prepend">
							<span className="input-group-text"><i className="fas fa-envelope"></i></span>
						</div>
						<input onChange={this.handleInput} value={this.state.remail} type="email" name="remail" id="remail" className="form-control" placeholder="Email" aria-label="Email" />
					</div>

					<div className="input-group mb-4">
						<div className="input-group-prepend">
							<span className="input-group-text"><i className="fas fa-user"></i></span>
						</div>
						<input onChange={this.handleInput} value={this.state.rusername} type="text" name="rusername" id="rusername" className="form-control" placeholder="Username" aria-label="Username" />
					</div>

					<div className="input-group mb-4">
						<div className="input-group-prepend">
							<span className="input-group-text"><i className="fas fa-key"></i></span>
						</div>
						<input onChange={this.handleInput} value={this.state.rpassword} type="password" name="rpassword" id="rpassword" className="form-control" placeholder="Password" aria-label="Password" />
					</div>

					<div className="form-group">
						<button type="submit" name="rsubmit" className="btn btn-warning btn-md text-white">Sign Up</button>
					</div>
					<div className="text-right">
						<span onClick={this.changeForm} href="/signin" className="text-primary">Login</span>
					</div>
				</form> : null }


				{/* Login Success Alert */}
				{this.state.user.username !== undefined ?
				<div className="alert alert-success" role="alert">
					{`Welcome, ${this.state.user.username}`}
				</div> : null}
				
				{/* Login Fail Alert */}
				{this.state.error.length > 0 ? 
				<div className="alert alert-warning" role="alert">
					{this.state.error}
				</div> : null}

				{user.email !== null && user.username !== null && user.password !== null ? <p>Already signed in, do you want to <span className="text-danger" onClick={this.logout}>sign out</span>?</p> : null}

			</div>
		)
	}
}

SignIn.propTypes = {
	user: PropTypes.object.isRequired,
	loginUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    user: state.siteData.user,
});

export default connect(mapStateToProps, { loginUser, signOut })(SignIn);