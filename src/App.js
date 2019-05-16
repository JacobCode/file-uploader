import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import store from './redux/store';

// Reset default css on browsers
import './reset.css';

// Components
import SignIn from './components/SignIn';
import Navbar from './components/Navbar';

// Containers
import Uploads from './containers/Uploads';

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<BrowserRouter>
					<div className="App container">
						<Navbar />
						<Switch>
							<Route path="/uploads" component={Uploads} exact />
							<Route path="/signin" component={SignIn} exact />
							<Redirect from="/signup" to="/signin" />
							<Redirect from="/login" to="/signin" />
							<Redirect from="/" to="/signin" />
							<Redirect from="/upload" to="/uploads" />
						</Switch>
					</div>
				</BrowserRouter>
			</Provider>
		);
  	}
}

export default App;
