import { LOGIN_USER, SIGN_OUT } from './types';

// User Info
export const loginUser = (user) => dispatch => {
	console.log(user);
	dispatch({
		type: LOGIN_USER,
		payload: user
	});
}

export const signOut = () => dispatch => {
	const emptyUser = {
		id: null,
		files: [],
		email: null,
		username: null
	}
	dispatch({
		type: SIGN_OUT,
		payload: emptyUser
	})
}