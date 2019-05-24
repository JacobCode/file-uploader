import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import store from './redux/store';

// Reset default css on browsers
import './css/reset.css';

// Layout
import Navbar from './layout/Navbar';

// Components
import SignIn from './components/SignIn';
import Edit from './components/Edit';
import Error from './components/Error';

// Containers
import Home from './containers/Home';
import Uploads from './containers/Uploads';

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<BrowserRouter>
					<div className="App">
						<Navbar />
						<Switch>
							<Route path="/" component={Home} exact />
							<Route path="/signin" component={SignIn} exact />
							<Route path="/edit" component={Edit} exact />
							<Route path="/uploads" component={Uploads} exact />
							<Route component={Error} />
						</Switch>
					</div>
				</BrowserRouter>
			</Provider>
		);
  	}
}

export default App;
