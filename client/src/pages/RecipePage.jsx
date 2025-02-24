import React from "react";
import { useParams } from "react-router-dom";
import RecipeDetail from "../components/RecipeDetail";
import RecipeComments from "../components/RecipeComment";

import "../CSS/RecipePage.css";

const RecipePage = () => {
  const { id } = useParams(); // Extract the `id` parameter from the URL

  return (
    <div className='recipe-page'>
      <RecipeDetail id={id} /> {/* Pass the `id` as a prop */}
      <RecipeComments recipeId={id} /> {/* Add the RecipeComments component */}
    </div>
  );
};

export default RecipePage;
