import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Store from './redux/store';
import { loadUser, loadProprietor } from './redux/actions/user';

import {
	ErrorPage,
	HomePage,
	UserActivationPage,
	UserLoginPage,
	UserRegisterPage,
	PasswordResetPage,
	ForgotPasswordPage,
	ProfilePage
} from './routes/Routes';

import {
	ProprietorActivationPage,
	ProprietorLoginPage,
	ProprietorRegisterPage,
	ProprietorHomePage,
	ProprietorDashboardPage
} from './routes/VenueRoutes';

import ProtectedRoute from './routes/ProtectedRoute';
import ProprietorProtectedRoute from './routes/ProprietorProtectedRoute';

const App = () => {
	useEffect(() => {
		Store.dispatch(loadUser());
		Store.dispatch(loadProprietor());
	}, []);
	return (
		<div className="font-roboto">
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/register" element={<UserRegisterPage />} />
				<Route path="/login" element={<UserLoginPage />} />
				<Route path="/activation/:activation_token" element={<UserActivationPage />} />
				<Route path="/password-reset" element={<PasswordResetPage />} />
				<Route path="/forgotpassword" element={<ForgotPasswordPage />} />
				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<ProfilePage />
						</ProtectedRoute>
					}
				/>
				{/* Proprietor */}
				<Route path="/proprietor-register" element={<ProprietorRegisterPage />} />
				<Route path="/proprietor-login" element={<ProprietorLoginPage />} />
				<Route
					path="/proprietor/activation/:activation_token"
					element={<ProprietorActivationPage />}
				/>
				<Route
					path="/proprietor/:id"
					element={
						<ProprietorProtectedRoute>
							<ProprietorHomePage />
						</ProprietorProtectedRoute>
					}
				/>
				<Route
					path="/proprietor/dashboard"
					element={
						<ProprietorProtectedRoute>
							<ProprietorDashboardPage />
						</ProprietorProtectedRoute>
					}
				/>
				<Route path="*" element={<ErrorPage />} />
			</Routes>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
			/>
		</div>
	);
};

export default App;
