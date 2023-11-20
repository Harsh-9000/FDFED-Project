import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '../../utils/helper';
import Loader from '../Layout/Loader';
import { CgSpinner } from 'react-icons/cg';
import { toast } from 'react-toastify';
import axios from 'axios';
import { server } from '../../server';

const ForgotPassword = () => {
	const { state } = useLocation();
	let query = useQuery();
	const navigate = useNavigate();
	const email = state?.email;
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	// eslint-disable-next-line
	const [role, setRole] = useState(query.get('role'));
	const [pageLoader, setPageLoader] = useState(true);
	const [isChangingPassword, setIsChangingPassword] = useState(false);

	console.log(role, email);

	// for transfering the user to the respective login page according to the role after changing password
	let LoginLink;
	if (role === 'user') {
		LoginLink = '/login';
	} else if (role === 'proprietor') {
		LoginLink = '/proprietor-login';
	}

	const handleShowPassword = () => {
		setShowPassword((prevState) => !prevState);
	};

	const handleShowConfirmPassword = () => {
		setShowConfirmPassword((prevState) => !prevState);
	};

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid }
	} = useForm({
		defaultValues: {
			password: '',
			confirmPassword: ''
		},
		mode: 'onChange'
	});

	const submitHandler = async (data) => {
		const { password } = data;
		try {
			setIsChangingPassword(true);
			const response = await axios.put(
				`${server}/auth/changePassword`,
				{
					role: role,
					email,
					password
				},
				{ withCredentials: true }
			);
			console.log(response);
			setIsChangingPassword(false);
			toast.success(response.data.message);
			navigate(LoginLink, { replace: true });
		} catch (error) {
			setIsChangingPassword(false);
			if (error.response && error.response.data.message) toast.error(error.response.data.message);
			else toast.error(error.message);
			console.log(error);
		}
	};

	useEffect(() => {
		if (!email || (role !== 'user' && role !== 'proprietor')) {
			navigate('/', { replace: true });
		}
		setPageLoader(false);
	}, [role, navigate, email]);

	return (
		<>
			{pageLoader ? (
				<Loader />
			) : (
				<div className="max-h-screen w-full">
					<section className=" flex min-h-screen w-full items-center justify-center bg-gray-200">
						<div className=" mx-auto my-10 max-w-2xl rounded-2xl bg-white p-12 font-roboto shadow-lg lg:max-w-3xl">
							<div>
								<h2 className=" mb-1 text-center font-roboto  text-2xl font-semibold sm:text-3xl">
									Enter Your New Password
								</h2>
								<p className="mx-auto text-center font-roboto text-xs text-[#959595]">
									please choose the new password
								</p>
							</div>

							<form onSubmit={handleSubmit(submitHandler)} className="mx-4 my-8 ">
								<div className="flex flex-col space-y-5">
									<div>
										<div className="relative">
											<label
												htmlFor="password"
												className="block text-sm font-semibold text-gray-700"
											>
												Password
											</label>
											<input
												type={showPassword ? 'text' : 'password'}
												autoComplete="new-password"
												id="password"
												{...register('password', {
													required: {
														value: true,
														message: 'Password is required'
													},
													minLength: {
														value: 6,
														message: 'Password length must be at least 6 characters'
													}
												})}
												placeholder="Enter Password"
												className={`mt-2 w-full rounded-lg border bg-gray-200 py-3 pl-4 pr-9 font-roboto text-sm placeholder:font-roboto placeholder:text-sm
                focus:bg-white focus:outline-none ${
									errors.password ? 'border-red-500' : 'border-[#c3cad9]'
								} `}
											/>
											{errors.password?.message && (
												<p className="mt-1 text-xs text-red-500">{errors.password?.message}</p>
											)}
											<div
												className="icon_button absolute right-2 top-[38px] opacity-80"
												onClick={handleShowPassword}
											>
												{showPassword ? (
													<AiOutlineEye className="h-7 text-2xl font-extralight text-gray-500" />
												) : (
													<AiOutlineEyeInvisible className="h-7 text-2xl font-extralight text-gray-500" />
												)}
											</div>
										</div>
										{/* ---------------------- */}
										<div className="relative mt-4">
											<label
												htmlFor="confirmPassword"
												className="block text-sm font-semibold text-gray-700"
											>
												Confirm Password
											</label>
											<input
												type={showConfirmPassword ? 'text' : 'password'}
												autoComplete="new-password"
												id="confirmPassword"
												{...register('confirmPassword', {
													required: {
														value: true,
														message: 'Confirm password is required'
													},
													validate: (value) => {
														if (value !== watch('password')) {
															return 'Passwords do not match';
														}
													}
												})}
												placeholder="Enter Confirm Password"
												className={`mt-2 w-full rounded-lg border bg-gray-200 py-3 pl-4 pr-9 font-roboto text-sm placeholder:font-roboto placeholder:text-sm
                focus:bg-white focus:outline-none ${
									errors.confirmPassword ? 'border-red-500' : 'border-[#c3cad9]'
								} `}
											/>
											{errors.confirmPassword?.message && (
												<p className="mt-1 text-xs text-red-500">
													{errors.confirmPassword?.message}
												</p>
											)}
											<div
												className="icon_button absolute right-2 top-[38px] opacity-80"
												onClick={handleShowConfirmPassword}
											>
												{showConfirmPassword ? (
													<AiOutlineEye className="h-7 text-2xl font-extralight text-gray-500" />
												) : (
													<AiOutlineEyeInvisible className="h-7 text-2xl font-extralight text-gray-500" />
												)}
											</div>
										</div>
									</div>

									<button
										type="submit"
										disabled={!isValid}
										className={`w-full rounded-lg bg-[#0062AD] py-3 font-medium text-white ${
											isValid ? 'hover:bg-blue-800 focus:bg-blue-800' : ''
										} inline-flex items-center justify-center space-x-2 hover:shadow disabled:cursor-not-allowed disabled:opacity-70`}
									>
										{isChangingPassword ? (
											<span className="mx-auto">
												<CgSpinner size={20} className=" inline animate-spin" />{' '}
											</span>
										) : (
											<span>Save New Password</span>
										)}
									</button>
								</div>
							</form>
						</div>
					</section>
				</div>
			)}
		</>
	);
};

export default ForgotPassword;
