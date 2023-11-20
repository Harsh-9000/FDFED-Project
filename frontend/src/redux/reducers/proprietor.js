import { createReducer } from '@reduxjs/toolkit';

const initialState = {
	isLoading: true,
	isProprietor: false,
	error: null,
	proprietor: null
};

export const proprietorReducer = createReducer(initialState, {
	LoadProprietorRequest: (state) => {
		state.isLoading = true;
	},
	LoadProprietorSuccess: (state, action) => {
		state.isProprietor = true;
		state.isLoading = false;
		state.proprietor = action.payload;
	},
	LoadProprietorFail: (state, action) => {
		state.isLoading = false;
		state.error = action.payload;
		state.isProprietor = false;
	},
	clearErrors: (state) => {
		state.error = null;
	}
});
