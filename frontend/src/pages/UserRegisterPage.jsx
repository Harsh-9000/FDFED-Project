import React, { useEffect } from 'react';
import Register from '../components/Register/Register';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../components/Layout/Loader';

const UserRegisterPage = () => {
	const navigate = useNavigate();
	const { isAuthenticated, loading } = useSelector((state) => state.user);

	useEffect(() => {
		if (isAuthenticated === true) {
			navigate('/', { replace: true });
		}
		// eslint-disable-next-line
	}, [isAuthenticated]);

	if (loading) return <Loader />;

	return (
		<div className="max-h-screen w-full">
			<section className=" flex min-h-screen w-full items-center justify-center bg-gray-200">
				<Register />
			</section>
		</div>
	);
};

export default UserRegisterPage;
