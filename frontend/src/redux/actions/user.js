import axios from 'axios';
import { server } from '../../server';

// load user
export const loadUser = () => async (dispatch) => {
	try {
		dispatch({
			type: 'LoadUserRequest'
		});
		const { data } = await axios.get(`${server}/user/getuser`, { withCredentials: true });
		dispatch({
			type: 'LoadUserSuccess',
			payload: data.user
		});
	} catch (error) {
		dispatch({
			type: 'LoadUserFail',
			payload: error.response.data.message
		});
	}
};

// load seller
export const loadProprietor = () => async (dispatch) => {
	try {
		dispatch({
			type: 'LoadProprietorRequest'
		});
		const { data } = await axios.get(`${server}/proprietor/getProprietor`, {
			withCredentials: true
		});
		dispatch({
			type: 'LoadProprietorSuccess',
			payload: data.proprietor
		});
	} catch (error) {
		dispatch({
			type: 'LoadProprietorFail',
			payload: error.response.data.message
		});
	}
};
