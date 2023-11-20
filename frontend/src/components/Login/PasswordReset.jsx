import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import OtpModal from './OtpModal';
import Loader from '../Layout/Loader';
import { CgSpinner } from 'react-icons/cg';
import { toast } from 'react-toastify';
import { useQuery } from '../../utils/helper';
import axios from 'axios';
import { server } from '../../server';

const PasswordReset = () => {
	let query = useQuery();
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	// eslint-disable-next-line
	const [role, setRole] = useState(query.get('role'));
	const [pageLoader, setPageLoader] = useState(true);
	const [isRequesting, setIsRequesting] = useState(false);
	const [isOtpValidating, setIsOtpValidating] = useState(false);

	// for transfering to the respective register page according to role
	let registerLink;
	if (role === 'user') {
		registerLink = '/register';
	} else if (role === 'proprietor') {
		registerLink = '/proprietor-register';
	}

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid }
	} = useForm({
		defaultValues: {
			email: ''
		},
		mode: 'onChange'
	});

	useEffect(() => {
		if (role !== 'user' && role !== 'proprietor') {
			navigate('/', { replace: true });
		}
		setPageLoader(false);
	}, [role, navigate]);

	const submitHandler = async (data) => {
		const { email } = data;
		try {
			setIsRequesting(true);
			const response = await axios.post(
				`${server}/auth/forgotPassword`,
				{
					role: role,
					email
				},
				{ withCredentials: true }
			);
			console.log(response);
			setIsRequesting(false);
			setIsModalOpen(true);
			toast.success(response.data.message);
		} catch (error) {
			setIsRequesting(false);
			if (error.response && error.response.data.message) toast.error(error.response.data.message);
			else toast.error(error.message);
			console.log(error);
		}
	};

	const OTPVerifyHandle = async (otp) => {
		console.log(otp, 'submitted');
		const email = watch('email');
		console.log(email, otp);
		try {
			setIsOtpValidating(true);
			const response = await axios.post(
				`${server}/auth/validateOtp`,
				{
					otpNumber: otp,
					email
				},
				{ withCredentials: true }
			);
			setIsOtpValidating(false);
			console.log(response);
			navigate(`/forgotpassword?role=${role}`, { state: { email: email }, replace: true });
			toast.success(response.data.message);
		} catch (error) {
			setIsOtpValidating(false);
			if (error.response && error.response.data.message) toast.error(error.response.data.message);
			else toast.error(error.message);
			console.log(error);
		}
	};

	const resendOTPHandle = async () => {
		const email = watch('email');
		const response = await axios.post(
			`${server}/auth/forgotPassword`,
			{
				role: role,
				email
			},
			{ withCredentials: true }
		);
		console.log(response);
		toast.success(response.data.message);
		//handled error in otpModal bcoz calling this async fxn from there async function
	};

	return (
		<>
			{' '}
			{pageLoader ? (
				<Loader />
			) : (
				<>
					{' '}
					{isModalOpen && (
						<OtpModal
							OTPVerifyHandle={OTPVerifyHandle}
							resendOTPHandle={resendOTPHandle}
							isModalOpen={isModalOpen}
							setIsModalOpen={setIsModalOpen}
							isOtpValidating={isOtpValidating}
						/>
					)}
					<div className="max-h-screen w-full">
						<section className=" flex min-h-screen w-full items-center justify-center bg-gray-200">
							<div className=" mx-auto my-10 max-w-2xl rounded-2xl  bg-white p-12 font-roboto shadow-lg lg:max-w-3xl">
								<div>
									<h2 className=" mb-1 text-center font-roboto  text-2xl font-semibold sm:text-3xl">
										Reset password
									</h2>
									<p className="mx-auto text-center font-roboto text-xs text-[#959595]">
										Fill up the form to reset the password
									</p>
								</div>

								<form onSubmit={handleSubmit(submitHandler)} className="mx-4 my-8 ">
									<div className="flex flex-col space-y-5">
										<div>
											<label
												htmlFor="email"
												className="mb-1 block text-sm  font-medium text-gray-700"
											>
												Email Address
											</label>
											<input
												type="email"
												id="email"
												{...register('email', {
													pattern: {
														value:
															/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
														message: 'Enter a valid email'
													},
													required: {
														value: true,
														message: 'Email is required'
													}
												})}
												placeholder="Enter Email Address"
												className={`mt-2 w-full rounded-lg border bg-gray-200 px-4 py-3 font-roboto text-sm placeholder:font-roboto placeholder:text-sm focus:bg-white focus:outline-none ${
													errors.email ? 'border-red-500' : 'border-[#c3cad9]'
												}`}
											/>
											{errors.email?.message && (
												<p className="mt-1 text-xs text-red-500">{errors.email?.message}</p>
											)}
										</div>

										<button
											type="submit"
											disabled={!isValid}
											className={`w-full rounded-lg bg-[#0062AD] py-3 font-medium text-white ${
												isValid ? 'hover:bg-blue-800 focus:bg-blue-800' : ''
											} inline-flex items-center justify-center space-x-2 hover:shadow disabled:cursor-not-allowed disabled:opacity-70`}
										>
											{isRequesting ? (
												<span className="mx-auto">
													<CgSpinner size={20} className=" inline animate-spin" />{' '}
												</span>
											) : (
												<>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														strokeWidth="1.5"
														stroke="currentColor"
														className="h-6 w-6"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
														/>
													</svg>
													<span>Reset password</span>
												</>
											)}
										</button>

										<p className="text-center text-xs font-semibold text-gray-700 lg:text-sm">
											Not registered yet?{' '}
											<Link
												to={registerLink}
												className="inline-flex  items-center space-x-1 font-medium text-primary hover:text-blue-800 focus:text-blue-800"
											>
												<span>Register now</span>
												<span>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-4 w-4"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														strokeWidth="2"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
														/>
													</svg>
												</span>
											</Link>
										</p>
									</div>
								</form>
							</div>
						</section>
					</div>
				</>
			)}
		</>
	);
};

export default PasswordReset;
