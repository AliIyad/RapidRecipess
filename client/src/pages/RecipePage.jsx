import React from 'react';
import { useParams } from 'react-router-dom';
import RecipeDetail from '../components/RecipeDetail';
import '../CSS/RecipePage.css';

const RecipePage = () => {
  const { id } = useParams();
  
  return (
    <div className="recipe-page">
      <RecipeDetail id={id} />
    </div>
  );
};

export default RecipePage;
