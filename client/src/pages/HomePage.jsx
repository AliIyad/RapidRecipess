import React, { useState } from "react";
import FeaturedRecipesCarousel from "../components/FeaturedRecipes";
import RecipeForm from "../components/RecipeForm";
import RecipeDashboard from "../components/RecipeDashboard";

import "../CSS/HomePage.css";

const Home = () => {
  const [recipes, setRecipes] = useState([]);

  const defaultRecipes = [
    {
      name: "Lasagna",
      description: "Warm, cheesy, and filling!",
      imageUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      name: "Spaghetti",
      description: "A classic Italian dish with a rich and meaty sauce.",
      imageUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      name: "Pizza",
      description: "Soft, Spicy and delicious!",
      imageUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  ];

  return (
    <>
      <div className='home-page'>
        <div className='home-header'>
          <h1>Welcome to Rapid Recipes!</h1>
        </div>

        <div className='home-banner'>
          <h1>Featured Recipes</h1>
          <FeaturedRecipesCarousel recipes={defaultRecipes} />
        </div>

        <div className='home-recipe-form'>
          <h1>Share Your Own Recipe</h1>
          <RecipeForm setRecipes={setRecipes} />
        </div>

        <div className='home-recipe-dashboard'>
          <h1>Your Dashboard Feed</h1>
          <RecipeDashboard recipes={recipes} />
        </div>
      </div>
    </>
  );
};

export default Home;
