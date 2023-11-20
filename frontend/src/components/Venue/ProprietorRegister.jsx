import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { RxAvatar } from 'react-icons/rx';
import { createPortal } from 'react-dom';
import CropEasy from '../crop/CropEasy';
import axios from 'axios';
import { server } from '../../server';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { CgSpinner } from 'react-icons/cg';

// businessName, phoneNumber, businessAddress

export const ProprietorRegister = () => {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [avatar, setAvatar] = useState(null);
	const [openCrop, setOpenCrop] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleShowPassword = () => {
		setShowPassword((prevState) => !prevState);
	};

	const handleShowConfirmPassword = () => {
		setShowConfirmPassword((prevState) => !prevState);
	};

	const handleFileInputChange = (e) => {
		// console.log('you clicked me');
		const file = e.target.files[0];
		// console.log(file, 'hello');
		if (file) {
			setAvatar({ url: URL.createObjectURL(file), file });
			setOpenCrop(true);
			// Clear the input value to allow selecting the same file again
			e.target.value = null;
		}
	};

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		watch
	} = useForm({
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			confirmPassword: '',
			businessName: '',
			phoneNumber: '',
			businessAddress: ''
		},
		mode: 'onChange'
	});

	const submitHandler = async (data) => {
		const { firstName, lastName, email, password, businessName, phoneNumber, businessAddress } =
			data;
		// console.log(data);
		const fullName = firstName + ' ' + lastName;
		const config = { headers: { 'Content-Type': 'multipart/form-data' } };
		const newForm = new FormData();
		// console.log(avatar);
		newForm.append('file', avatar?.file);
		newForm.append('name', fullName);
		newForm.append('email', email);
		newForm.append('password', password);
		newForm.append('businessName', businessName);
		newForm.append('phoneNumber', phoneNumber);
		newForm.append('businessAddress', businessAddress);

		try {
			setIsLoading(true);
			const res = await axios.post(`${server}/proprietor/create-proprietor`, newForm, config);
			console.log(res);
			toast.success(res?.data.message);
			setIsLoading(false);
			navigate('/proprietor-login');
		} catch (error) {
			setIsLoading(false);
            if (error.response && error.response.data.message) toast.error(error.response.data.message);
			else toast.error(error.message);
			console.log(error);
		}
	};

	return (
		<div className=" my-12 rounded-2xl bg-gray-100 py-12 shadow-lg xs:max-w-[80%] sm:max-w-[60%] sm:p-4 lg:max-w-[40%]  ">
			{openCrop &&
				createPortal(
					<CropEasy avatar={avatar} setAvatar={setAvatar} setOpenCrop={setOpenCrop} />,
					document.getElementById('portal')
				)}
			<div className="mx-auto px-10 sm:px-3 sm:py-3  md:py-5">
				<div className="mb-6 text-center xs:px-8 ">
					<h2 className=" font-roboto text-3xl font-semibold ">Welcome</h2>
					<p className="text-xs text-[#959595]">
						Register to establish your account and unlock a realm of business opportunities and
						tools designed for proprietors!
					</p>
				</div>
				<form className="" onSubmit={handleSubmit(submitHandler)}>
					<div className="flex flex-row items-start justify-between gap-x-4">
						<div className="w-1/2">
							<label htmlFor="firstName" className="block text-sm font-semibold  text-gray-700">
								First Name
							</label>
							<input
								type="text"
								id="firstName"
								{...register('firstName', {
									minLength: {
										value: 1,
										message: 'First Name length must be at least 1 character'
									},
									required: {
										value: true,
										message: 'First Name is required'
									}
								})}
								placeholder="Enter First Name"
								className={`mt-2 w-full rounded-lg border bg-gray-200 px-4 py-3 font-roboto text-sm placeholder:font-roboto placeholder:text-sm focus:bg-white focus:outline-none ${
									errors.firstName ? 'border-red-500' : 'border-[#c3cad9]'
								}`}
							/>
							{errors.firstName?.message && (
								<p className="mt-1 text-xs  text-red-500">{errors.firstName?.message}</p>
							)}
						</div>
						<div className="w-1/2">
							<label htmlFor="lastName" className="block text-sm font-semibold  text-gray-700">
								Last Name
							</label>
							<input
								type="text"
								id="lastName"
								{...register('lastName', {
									minLength: {
										value: 1,
										message: 'Last Name length must be at least 1 character'
									},
									required: {
										value: true,
										message: 'Last Name is required'
									}
								})}
								placeholder="Enter Last Name"
								className={`mt-2 w-full rounded-lg border bg-gray-200 px-4 py-3 font-roboto text-sm placeholder:font-roboto placeholder:text-sm focus:bg-white focus:outline-none ${
									errors.lastName ? 'border-red-500' : 'border-[#c3cad9]'
								}`}
							/>
							{errors.lastName?.message && (
								<p className="mt-1 text-xs text-red-500">{errors.lastName?.message}</p>
							)}
						</div>
					</div>

					<div className="mt-4">
						<label htmlFor="businessName" className="block text-sm font-semibold  text-gray-700">
							Business Name
						</label>
						<input
							type="text"
							autoComplete="business-name"
							id="businessName"
							{...register('businessName', {
								required: {
									value: true,
									message: 'Business Name is required'
								},
								minLength: {
									value: 1,
									message: 'Business Name length must be at least 1 character'
								}
							})}
							placeholder="Enter Business Name"
							className={`mt-2 w-full rounded-lg border bg-gray-200 px-4 py-3 font-roboto text-sm placeholder:font-roboto placeholder:text-sm focus:bg-white focus:outline-none ${
								errors.businessName ? 'border-red-500' : 'border-[#c3cad9]'
							}`}
						/>
						{errors.businessName?.message && (
							<p className="mt-1 text-xs text-red-500">{errors.businessName?.message}</p>
						)}
					</div>

					<div className="mt-4">
						<label htmlFor="phoneNumber" className="block text-sm font-semibold  text-gray-700">
							Phone Number
						</label>
						<input
							type="number"
							id="phoneNumber"
							{...register('phoneNumber', {
								valueAsNumber: true,
								required: {
									value: true,
									message: 'Phone Number is required'
								},
								pattern: {
									value: /^(0|[1-9]\d*)(\.\d+)?$/, // Use regex pattern to validate 10 digits
									message: 'Please enter a valid  phone number'
								},
								validate: (value) => {
									let numberAsString = value.toString();
									if (numberAsString.length !== 10) {
										return 'Please enter a valid 10-digit phone number';
									}
								}
							})}
							placeholder="Enter Phone Number"
							className={`mt-2 w-full rounded-lg border bg-gray-200 px-4 py-3 font-roboto text-sm placeholder:font-roboto placeholder:text-sm focus:bg-white focus:outline-none ${
								errors.phoneNumber ? 'border-red-500' : 'border-[#c3cad9]'
							}`}
						/>
						{errors.phoneNumber?.message && (
							<p className="mt-1 text-xs text-red-500">{errors.phoneNumber?.message}</p>
						)}
					</div>

					<div className="mt-4">
						<label htmlFor="businessAddress" className="block text-sm font-semibold  text-gray-700">
							Business Address
						</label>
						<input
							type="text"
							id="businessAddress"
							autoComplete="business-address"
							{...register('businessAddress', {
								required: {
									value: true,
									message: 'Business Address is required'
								},
								minLength: {
									value: 1,
									message: 'Business Address length must be at least 1 character'
								}
							})}
							placeholder="Enter Phone Number"
							className={`mt-2 w-full rounded-lg border bg-gray-200 px-4 py-3 font-roboto text-sm placeholder:font-roboto placeholder:text-sm focus:bg-white focus:outline-none ${
								errors.businessAddress ? 'border-red-500' : 'border-[#c3cad9]'
							}`}
						/>
						{errors.businessAddress?.message && (
							<p className="mt-1 text-xs text-red-500">{errors.businessAddress?.message}</p>
						)}
					</div>

					<div className="mt-4">
						<label htmlFor="email" className="block text-sm font-semibold  text-gray-700">
							Email Address
						</label>
						<input
							type="email"
							id="email"
							autoComplete="email"
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
						<label htmlFor="password" className="block text-sm font-semibold text-gray-700">
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
    focus:bg-white focus:outline-none ${errors.password ? 'border-red-500' : 'border-[#c3cad9]'} `}
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
						<label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
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
							<p className="mt-1 text-xs text-red-500">{errors.confirmPassword?.message}</p>
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
					{/* ------------------------------------------- */}

					<div>
						<label htmlFor="avatar" className="block text-sm font-medium text-gray-700"></label>
						<div className="mb-4 mt-4 flex items-center">
							<label
								htmlFor="file-input"
								className="mr-[8px]  flex items-center justify-center rounded-md border border-gray-300 bg-gray-200 px-8 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:px-4"
							>
								<span>Upload a file</span>
								<input
									type="file"
									name="avatar"
									id="file-input"
									accept=".jpg,.jpeg,.png"
									onChange={handleFileInputChange}
									className="sr-only"
								/>
							</label>
							<span className="inline-block h-8 w-8 overflow-hidden rounded-full">
								{avatar ? (
									<img
										src={avatar?.url}
										alt="avatar"
										className="h-full w-full rounded-full object-cover"
									/>
								) : (
									<RxAvatar className="h-8 w-8 text-gray-500" />
								)}
							</span>
						</div>
					</div>
					{/* ------------------------------------------- */}
					<button
						type="submit"
						disabled={!isValid || !avatar}
						className={`block w-full bg-[#0062AD]   ${
							isValid ? 'hover:bg-blue-800 focus:bg-blue-800' : ''
						}  my-4 rounded-lg px-4
  py-3 font-semibold text-white disabled:cursor-not-allowed  disabled:opacity-70 md:my-3`}
					>
						{isLoading ? (
							<span className="mx-auto">
								<CgSpinner size={20} className=" inline animate-spin" />{' '}
							</span>
						) : (
							'Register'
						)}
					</button>
				</form>

				<p className=" text-center text-xs font-semibold text-gray-700 lg:text-sm ">
					Already have an account?{' '}
					<Link
						to="/proprietor-login"
						className="text-primary  hover:text-blue-800 focus:text-blue-800"
					>
						Login now
					</Link>
				</p>
			</div>
		</div>
	);
};
