import { LOGIN_USER, SIGN_OUT } from '../actions/types';

const emptyUser = {
	id: null,
	files: [],
	email: null,
	username: null
}

// Initial State
const initialState = {
  // User Info
  user: localStorage.user === undefined ? emptyUser : JSON.parse(localStorage.user)
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        user: action.payload
	  };
	case SIGN_OUT:
		return {
			...state,
			user: action.payload
		};
    default: return state;
  }
})