import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loader from '../components/Layout/Loader';

const ProprietorProtectedRoute = ({ children }) => {
	const { isLoading, isProprietor } = useSelector((state) => state.proprietor);
	if (isLoading === true) {
		return <Loader />;
	} else {
		if (!isProprietor) {
			return <Navigate to="/proprietor-login" replace />;
		}
		return children;
	}
};

export default ProprietorProtectedRoute;
