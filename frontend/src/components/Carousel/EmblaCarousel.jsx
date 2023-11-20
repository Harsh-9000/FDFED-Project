/* eslint-disable react/prop-types */
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

import './embla.css';

const EmblaCarousel = (props) => {
	const { slides, autoplayOptions } = props;
	const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay(autoplayOptions)]);

	return (
		<div className="embla">
			<div className="embla__viewport" ref={emblaRef}>
				<div className="embla__container">
					{slides.map((index) => (
						<div className="embla__slide" key={index}>
							<img className="embla__slide__img" src={props.imageByIndex(index)} alt="slider" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default EmblaCarousel;
