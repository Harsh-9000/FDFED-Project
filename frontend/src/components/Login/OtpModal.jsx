import React, { useEffect, useState } from 'react';
import Modal from '../Layout/Modal';
import { BsFillShieldLockFill } from 'react-icons/bs';
import OtpInput from 'otp-input-react';
import { CgSpinner } from 'react-icons/cg';
import { toast } from 'react-toastify';

const OtpModal = ({
	OTPVerifyHandle,
	resendOTPHandle,
	isModalOpen,
	setIsModalOpen,
	isOtpValidating
}) => {
	const [otp, setOtp] = useState('');
	const [minutes, setMinutes] = useState(5);
	const [seconds, setSeconds] = useState(0);
	const [isSixdigitOTP, setIsSixdigitOTP] = useState(false);
	const [isResending, setIsResending] = useState(false);

	console.log(otp);

	useEffect(() => {
		const interval = setInterval(() => {
			if (seconds > 0) {
				setSeconds(seconds - 1);
			}

			if (seconds === 0) {
				if (minutes === 0) {
					clearInterval(interval);
				} else {
					setSeconds(59);
					setMinutes(minutes - 1);
				}
			}
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, [seconds, minutes]);

	useEffect(() => {
		if (otp.length === 6) setIsSixdigitOTP(true);
		else {
			setIsSixdigitOTP(false);
		}
	}, [otp.length]);

	const handleResendOTPClick = async () => {
		try {
			setIsResending(true);
			await resendOTPHandle();
			setIsResending(false);
			setMinutes(5);
			setSeconds(0);
			setOtp('');
		} catch (error) {
			setIsResending(false);
			if (error.response && error.response.data.message) toast.error(error.response.data.message);
			else toast.error(error.message);
			console.log(error);
		}
	};

	const handleOTPVerifyClick = () => {
		OTPVerifyHandle(otp);
	};

	return (
		<>
			<Modal
				isOpen={isModalOpen}
				onCloseButton={() => {
					setIsModalOpen(false);
				}}
				maxWidth="500px"
			>
				<div className="mx-auto  w-fit rounded-full bg-white p-4 text-blue-800">
					<BsFillShieldLockFill size={60} />
				</div>
				<div className="flex flex-col items-center justify-center gap-y-4">
					<label htmlFor="otp" className="text-center text-xl  font-bold">
						Enter your OTP
					</label>
					<OtpInput
						value={otp}
						onChange={setOtp}
						OTPLength={6}
						otpType="number"
						disabled={false}
						autoFocus
						className="opt-container"
						inputStyles={{
							border: '1px solid black',
							height: '40px',
							width: '40px',
							marginRight: '7px',
							marginLeft: '7px',
							borderRadius: '5px'
						}}
					></OtpInput>
					<div className="countdown-text text-center text-xs font-semibold text-gray-700 lg:text-sm">
						{isResending ? (
							<span>Resending OTP...</span>
						) : seconds > 0 || minutes > 0 ? (
							<p>
								Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
								{seconds < 10 ? `0${seconds}` : seconds}
							</p>
						) : (
							<p>
								Didn&apos;t recieve the OTP?
								<span
									className={`cursor-pointer text-primary ${
										seconds > 0 || minutes > 0 ? 'hidden' : ''
									}`}
									disabled={seconds > 0 || minutes > 0}
									onClick={handleResendOTPClick}
								>
									{' '}
									RESEND
								</span>
							</p>
						)}
					</div>
					<button
						disabled={!isSixdigitOTP}
						onClick={handleOTPVerifyClick}
						className={`flex w-full items-center justify-center gap-1 
            rounded bg-[#0062AD] py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70  ${
							isSixdigitOTP ? 'hover:bg-blue-800 focus:bg-blue-800' : ''
						}`}
					>
						{isOtpValidating ? (
							<span className="mx-auto">
								<CgSpinner size={20} className=" inline animate-spin" />{' '}
							</span>
						) : (
							<span>Verify OTP</span>
						)}
					</button>
				</div>
			</Modal>
		</>
	);
};

export default OtpModal;
