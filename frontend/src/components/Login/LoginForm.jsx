import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';

const LoginForm = ({ title, description, submitHandler, onRegisterClickLink, isLoading, role }) => {
	const [showPassword, setShowPassword] = useState(false);

	const handleShowPassword = () => {
		setShowPassword((prevState) => !prevState);
	};

	const {
		register,
		handleSubmit,
		formState: { errors, isValid }
	} = useForm({
		defaultValues: {
			email: '',
			password: ''
		},
		mode: 'onChange'
	});

	const formSubmitHandler = (data) => {
		// const { email, password } = data;
		// console.log(data, 'child');
		submitHandler(data);
	};

	return (
		<div className="px-10 sm:px-3 sm:py-3 md:w-1/2 md:py-5">
			<div className="mb-10 text-center">
				<h2 className="mb-1 font-roboto text-3xl font-semibold ">{title}</h2>
				<p className="font-roboto px-4 text-xs text-[#959595]"> {description} </p>
			</div>
			<form className="mt-6" onSubmit={handleSubmit(formSubmitHandler)}>
				<div>
					<label htmlFor="email" className="block text-sm font-semibold  text-gray-700">
						Email Address
					</label>
					<input
						type="email"
						id="email"
						autoComplete="username"
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

				<div className="relative mt-4">
					<label className="block text-sm font-semibold text-gray-700">Password</label>
					<input
						type={showPassword ? 'text' : 'password'}
						autoComplete="current-password"
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

				<div className="mt-3 text-right">
					<Link
					     to={`/password-reset?role=${role}`}
						className="text-sm font-semibold text-primary  hover:text-blue-800 focus:text-blue-800"
					>
						Forgot Password?
					</Link>
				</div>

				<button
					type="submit"
					disabled={!isValid}
					className={`block w-full bg-[#0062AD]   ${
						isValid ? 'hover:bg-blue-800 focus:bg-blue-800' : ''
					}  my-4 rounded-lg px-4
                py-3 font-semibold text-white disabled:cursor-not-allowed  disabled:opacity-70 md:my-6 `}
				>
					{isLoading ? (
						<span className="mx-auto">
							<CgSpinner size={20} className=" inline animate-spin" />{' '}
						</span>
					) : (
						'Log In'
					)}
				</button>
			</form>

			<p className=" text-center text-xs font-semibold text-gray-700 lg:text-sm ">
				Don&rsquo;t have an account?{' '}
				<Link
					to={onRegisterClickLink}
					className="text-primary  hover:text-blue-800 focus:text-blue-800"
				>
					Register now
				</Link>
			</p>
		</div>
	);
};

export default LoginForm;
