import {
	LOGIN_USER,
	SIGN_OUT,
	GET_USER_FILES,
	DELETE_FILE
} from './types';
import axios from 'axios';

const API_URL = 'https://file-upload-db.herokuapp.com';

// User Info
export const loginUser = (user) => dispatch => {
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

export const getUserFiles = (userId) => dispatch => {
	axios.get(`${API_URL}/user/files/${userId}`)
		.then((res) => {
			dispatch({
				type: GET_USER_FILES,
				payload: res.data
			})
			// const numbers = [];
			// if (res.data.length >= 1) {
			// 	res.data.forEach(file => {
			// 		numbers.push(file.length)
			// 	});
			// 	const getSum = (total, num) => {
			// 		return total + num;
			// 	}
			// 	this.setState({
			// 		storage: this.convertBytes(numbers.reduce(getSum), 2),
			// 		storagePercent: (((numbers.reduce(getSum) / 1024) / 10000) * 100).toFixed(3)
			// 	});
			// }
		})
		.catch((err) => console.log(err));
}

export const deleteFile = (fileId, userId, files) => dispatch => {
	axios.get(`${API_URL}/files/delete/${fileId}/${userId}`)
		.then((res) => {
			dispatch({
				type: DELETE_FILE,
				payload: files.filter((f) => f._id !== fileId)
			})
		});
}