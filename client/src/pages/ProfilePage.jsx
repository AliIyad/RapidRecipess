import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const handleEditRecipe = (recipeId) => {
  // Navigate to edit page or show edit form
};

const handleDeleteRecipe = async (recipeId) => {
  try {
    await axios.delete(`/recipes/${recipeId}`);
    setRecipes(recipes.filter((recipe) => recipe._id !== recipeId));
  } catch (error) {
    console.error("Error deleting recipe:", error);
  }
};

const Profile = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`/recipes?user=${user._id}`);
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    fetchRecipes();
  }, [user]);

  return (
    <div>
      <h1>Profile</h1>
      <div>
        <h2>Edit Profile</h2>
        {/* Add form for editing profile */}
        WIP
      </div>
      <div>
        <h2>Your Recipes</h2>
        {recipes.map((recipe) => (
          <div key={recipe._id}>
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
            <button onClick={() => handleEditRecipe(recipe._id)}>Edit</button>
            <button onClick={() => handleDeleteRecipe(recipe._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
