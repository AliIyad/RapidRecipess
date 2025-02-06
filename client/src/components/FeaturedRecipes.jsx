import React, { useState } from "react";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const FeaturedRecipesCarousel = ({ recipes }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => {
    const nextIndex = activeIndex === recipes.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    const prevIndex = activeIndex === 0 ? recipes.length - 1 : activeIndex - 1;
    setActiveIndex(prevIndex);
  };

  return (
    <div
      className='featured-carousel-container'
      style={{ borderRadius: "15px", width: "100%", margin: "15px auto" }}>
      <Carousel
        activeIndex={activeIndex}
        next={next}
        previous={previous}
        interval={4000}
        ride='carousel'
        slide>
        <CarouselIndicators
          items={recipes}
          activeIndex={activeIndex}
          onClickHandler={setActiveIndex}
        />
        {recipes.map((recipe, index) => (
          <CarouselItem key={index}>
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              style={{
                width: "46rem",
                height: "auto",
                maxHeight: "250px",
                objectFit: "cover",
                borderRadius: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease-in-out",
                margin: "15px auto",
              }}
            />
            <div className='carousel-caption'>
              <h3>{recipe.name}</h3>
              <p>{recipe.description}</p>
            </div>
          </CarouselItem>
        ))}
        <CarouselControl
          direction='prev'
          directionText='Previous'
          onClickHandler={previous}
        />
        <CarouselControl
          direction='next'
          directionText='Next'
          onClickHandler={next}
        />
      </Carousel>
    </div>
  );
};

export default FeaturedRecipesCarousel;
