import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import store from './redux/store';

// Reset default css on browsers
import './reset.css';

// Components
import SignIn from './components/SignIn';
import Edit from './components/Edit';
import Navbar from './components/Navbar';
import Error from './components/Error';

// Containers
import Uploads from './containers/Uploads';

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<BrowserRouter>
					<div className="App">
						<Navbar />
						<div className="container">
							<Switch>
								<Route path="/signin" component={SignIn} exact />
								<Route path="/edit" component={Edit} exact />
								<Route path="/uploads" component={Uploads} exact />
								<Redirect from="/" to={localStorage.user !== undefined ? '/uploads' : '/signin'} />
								<Route component={Error} />
							</Switch>
						</div>
					</div>
				</BrowserRouter>
			</Provider>
		);
  	}
}

export default App;
