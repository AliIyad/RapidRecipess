import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const FeaturedRecipesCarousel = ({ recipes }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((prev) => (prev + 1) % recipes.length);
  const previous = () =>
    setActiveIndex((prev) => (prev === 0 ? recipes.length - 1 : prev - 1));

  return (
    <div className='featured-recipes-carousel'>
      <Carousel
        showThumbs={false}
        showStatus={false}
        selectedItem={activeIndex}
        onChange={(index) => setActiveIndex(index)}
        infiniteLoop={true}
        autoPlay={true}
        interval={5000}
        stopOnHover={true}>
        {recipes.map((recipe, index) => (
          <div key={index} className='carousel-slide'>
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className='carousel-image'
            />
            <p className='legend'>{recipe.name}</p>
          </div>
        ))}
      </Carousel>

      <div className='carousel-controls'>
        <button onClick={previous} className='carousel-button'>
          Previous
        </button>
        <button onClick={next} className='carousel-button'>
          Next
        </button>
      </div>
    </div>
  );
};

export default FeaturedRecipesCarousel;
