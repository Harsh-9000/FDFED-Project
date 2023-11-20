import React, { useEffect } from 'react';
import { ProprietorRegister } from '../../components/Venue/ProprietorRegister';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../../components/Layout/Loader';

const ProprietorRegisterPage = () => {
	const navigate = useNavigate();
	const { isProprietor, proprietor, isLoading } = useSelector((state) => state.proprietor);

	useEffect(() => {
		if (isProprietor === true) {
			navigate(`/proprietor/${proprietor?._id}`, { replace: true });
		}
		// eslint-disable-next-line
	}, [isProprietor]);

	if (isLoading) return <Loader />;

	return (
		<div className="max-h-screen w-full">
			<section className=" flex min-h-screen w-full items-center justify-center bg-gray-200">
				<ProprietorRegister />
			</section>
		</div>
	);
};

export default ProprietorRegisterPage;
