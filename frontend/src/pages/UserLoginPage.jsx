import React, { useEffect } from 'react';
import Login from '../components/Login/Login';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Layout/Loader';

const UserLoginPage = () => {
	const navigate = useNavigate();
	const { isAuthenticated, loading } = useSelector((state) => state.user);
	useEffect(() => {
		console.log('sorry ');
		if (isAuthenticated === true) {
			navigate('/', { replace: true });
		}
		// eslint-disable-next-line
	}, [isAuthenticated]);

	if (loading) return <Loader />;

	return (
		<div className="max-h-screen w-full">
			<section className=" flex min-h-screen w-full items-center justify-center bg-gray-200">
				<Login />
			</section>
		</div>
	);
};

export default UserLoginPage;
