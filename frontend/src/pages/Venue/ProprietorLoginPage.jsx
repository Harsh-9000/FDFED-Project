import React, { useEffect } from 'react';
import ProprietorLogin from '../../components/Venue/ProprietorLogin';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../../components/Layout/Loader';

const ProprietorLoginPage = () => {
	const navigate = useNavigate();
	const { isProprietor, isLoading } = useSelector((state) => state.proprietor);

	useEffect(() => {
		if (isProprietor === true) {
			navigate(`/proprietor/dashboard`, { replace: true });
		}
		// eslint-disable-next-line
	}, [isLoading, isProprietor]);

	if (isLoading) return <Loader />;

	return (
		<div className="max-h-screen w-full">
			<section className=" flex min-h-screen w-full items-center justify-center bg-gray-200">
				<ProprietorLogin />
			</section>
		</div>
	);
};

export default ProprietorLoginPage;
