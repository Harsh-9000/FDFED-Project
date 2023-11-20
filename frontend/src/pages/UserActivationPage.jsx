import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { server } from '../server';
import Loader from '../components/Layout/Loader';

const UserActivationPage = () => {
	const { activation_token } = useParams();
	const [error, setError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (activation_token) {
			const sendRequest = async () => {
				try {
					// eslint-disable-next-line
					const response = await axios.post(`${server}/user/activation`, {
						activation_token
					});
					// console.log(response);
					setIsLoading(false);
				} catch (error) {
					setError(true);
					setIsLoading(false);
				}
			};
			sendRequest();
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div
			style={{
				width: '100%',
				height: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			{' '}
			{isLoading && <Loader />}
			{!isLoading &&
				(error ? (
					<p>Your token is expired!</p>
				) : (
					<p>Your account has been created suceessfully!</p>
				))}
		</div>
	);
};

export default UserActivationPage;
