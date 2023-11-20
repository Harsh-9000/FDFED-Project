import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { server } from '../../server';
import LoginForm from './LoginForm';
import EmblaCarousel from '../Carousel/EmblaCarousel';
import axios from 'axios';

import { userSliderimageByIndex } from '../../assets/slideImageByIndex';
// ----------Carousel Transition part specific---------
const autoplayOptions = {
	delay: 4000,
	stopOnInteraction: false
};
const SLIDE_COUNT = 4;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());
//------------------------------------------------------

const Login = () => {
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const submitHandler = async (data) => {
		const { email, password } = data;
		console.log(data);
        try {
            setIsLoading(true);
            const response = await axios.post(
              `${server}/user/login-user`,
              {
                email,
                password,
              },
              { withCredentials: true }
            );
            console.log(response);
            setIsLoading(false);
            navigate("/");
            toast.success("Login Successfull!");
            window.location.reload(true);
          } catch (error) {
            setIsLoading(false);
            if (error.response && error.response.data.message) toast.error(error.response.data.message);
			else toast.error(error.message);
			console.log(error);
          }
	};

	return (
		<div className="flex max-w-2xl justify-around rounded-2xl bg-gray-100 py-12 shadow-lg sm:p-4 lg:max-w-3xl ">
			<LoginForm
				title="Welcome Back"
				description="Our proprietors and vendors eagerly await you!"
				submitHandler={submitHandler}
				onRegisterClickLink="/register"
				isLoading={isLoading}
				role="user"
			/>
			<div className="hidden w-1/2 sm:block sm:pl-3  ">
				<EmblaCarousel
					slides={SLIDES}
					imageByIndex={userSliderimageByIndex}
					autoplayOptions={autoplayOptions}
				/>
			</div>
		</div>
	);
};

export default Login;
