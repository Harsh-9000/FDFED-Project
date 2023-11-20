import RegisterForm from './RegisterForm';
import EmblaCarousel from '../Carousel/EmblaCarousel';

import { userSliderimageByIndex } from '../../assets/slideImageByIndex';
// ----------Carousel Transition part specific---------
const autoplayOptions = {
	delay: 4000,
	stopOnInteraction: false
};
const SLIDE_COUNT = 4;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());
//------------------------------------------------------

const Register = () => {
	return (
		<div className="flex max-w-2xl justify-around rounded-2xl bg-gray-100 py-12 shadow-lg sm:p-4 lg:max-w-3xl ">
			<RegisterForm />
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

export default Register;
