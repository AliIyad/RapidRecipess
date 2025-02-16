import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const FeaturedRecipesCarousel = ({ recipes }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((prev) => (prev + 1) % recipes.length);
  const previous = () =>
    setActiveIndex((prev) => (prev === 0 ? recipes.length - 1 : prev - 1));

  return (
    <Carousel showThumbs={false} showStatus={false} selectedItem={activeIndex}>
      {recipes.map((recipe, index) => (
        <div key={index}>
          <img src={recipe.imageUrl} alt={recipe.name} />
          <p className='legend'>{recipe.name}</p>
        </div>
      ))}
    </Carousel>
  );
};

export default FeaturedRecipesCarousel;
