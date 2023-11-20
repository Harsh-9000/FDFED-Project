import ReactDOM from 'react-dom';
// eslint-disable-next-line
import loaderStyles from "./loaderStyles.css";

const Loader = () => {
	return ReactDOM.createPortal(
		<div className="fixed z-10 h-screen w-screen">
			<div className="fixed left-1/2 top-1/2 z-[999] -translate-x-2/4 -translate-y-2/4">
				<div className="spinner_container" aria-label="Loading...">
					<i className="spinner_item spinner_item--primary"></i>
					<i className="spinner_item spinner_item--primary"></i>
				</div>
			</div>
		</div>,
		document.getElementById('loader')
	);
};

export default Loader;
