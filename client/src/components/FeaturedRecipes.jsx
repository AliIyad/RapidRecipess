import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios"; // For making API requests

const FeaturedRecipesCarousel = () => {
  const [recipes, setRecipes] = useState([]); // State to store fetched recipes
  const [activeIndex, setActiveIndex] = useState(0); // State for active carousel slide
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors

  // Fetch most liked recipes
  useEffect(() => {
    const fetchMostLikedRecipes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:6969/recipe/most-liked",
          {
            params: { limit: 5 }, // Fetch top 5 most liked recipes
          }
        );

        // Log the API response for debugging
        console.log("API Response:", response.data);

        // Ensure the response data is an array
        if (Array.isArray(response.data)) {
          setRecipes(response.data); // Set fetched recipes to state
        } else {
          throw new Error("Invalid data format: Expected an array of recipes.");
        }
      } catch (error) {
        console.error("Error fetching most liked recipes:", error);
        setError("Failed to fetch recipes. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false after the request completes
      }
    };

    fetchMostLikedRecipes();
  }, []);

  // Carousel controls
  const next = () => setActiveIndex((prev) => (prev + 1) % recipes.length);
  const previous = () =>
    setActiveIndex((prev) => (prev === 0 ? recipes.length - 1 : prev - 1));

  // Render loading or error messages
  if (loading) {
    return <p className='text-muted'>Loading featured recipes...</p>;
  }

  if (error) {
    return <p className='text-danger'>{error}</p>;
  }

  if (recipes.length === 0) {
    return <p className='text-muted'>No featured recipes available.</p>;
  }

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
              src={recipe.imageUrl || "https://via.placeholder.com/150"}
              alt={recipe.title}
              className='carousel-image'
            />
            <p className='legend'>{recipe.title}</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default FeaturedRecipesCarousel;
