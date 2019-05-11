import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

// Reset default css on browsers
import './reset.css';

// Components
import UploadForm from './components/UploadForm';
import SignIn from './components/SignIn';

class App extends Component {
  render() {
	  return (
		<BrowserRouter>
			<div className="App container">
				<h1 className="mb-4 mt-4" style={{fontSize: '1.5rem'}}>File Uploader</h1>
				<Switch>
					<Route path={process.env.PUBLIC_URL + '/uploads'} component={UploadForm} exact />
					<Route path={process.env.PUBLIC_URL + '/signin'} component={SignIn} exact />
					<Redirect from="/signup" to="/signin" />
					<Redirect from="/login" to="/signin" />
				</Switch>
			</div>
		</BrowserRouter>
	);
  }
}

export default App;
