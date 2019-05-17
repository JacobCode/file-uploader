import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
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
							<Route path="/" component={SignIn} exact />
							<Route path="/uploads" component={Uploads} exact />
						</Switch>
					</div>
				</BrowserRouter>
			</Provider>
		);
  	}
}

export default App;
