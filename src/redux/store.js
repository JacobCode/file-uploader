import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

// Array of middleware
const middleware = [thunk];
// Store
const store = createStore(
  rootReducer,
  initialState,
  compose(
    // Add middleware
    applyMiddleware(...middleware)
    // ,
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;