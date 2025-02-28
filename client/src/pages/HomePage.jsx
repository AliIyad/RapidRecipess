import React, { useState } from "react";
import FeaturedRecipesCarousel from "../components/FeaturedRecipes";
import RecipeForm from "../components/RecipeForm";
import RecipeDashboard from "../components/RecipeDashboard";

import "../CSS/HomePage.css";

const Home = () => {
  const [recipes, setRecipes] = useState([]);

  return (
    <>
      <div className='home-page'>
        <div className='home-header'>
          <h1>Welcome to Rapid Recipes!</h1>
        </div>

        <div className='home-banner'>
          <h1>Featured Recipes</h1>
          <FeaturedRecipesCarousel recipes={recipes} />
        </div>
        <div className='home-recipe-dashboard'>
          <h1>Your Dashboard Feed</h1>
          <RecipeDashboard />
        </div>
      </div>
      <RecipeForm setRecipes={setRecipes} />
    </>
  );
};

export default Home;
