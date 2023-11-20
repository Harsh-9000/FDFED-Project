import userSliderimage1 from './userLoginSliderImages/slide-1.jpg';
import userSliderimage2 from './userLoginSliderImages/slide-2.jpg';
import userSliderimage3 from './userLoginSliderImages/slide-3.jpg';
import userSliderimage4 from './userLoginSliderImages/slide-4.jpg';

export const images = [userSliderimage1, userSliderimage2, userSliderimage3, userSliderimage4];

const userSliderimageByIndex = (index) => images[index % images.length];

export { userSliderimageByIndex };
