import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, CardBody, CardTitle, CardText } from "reactstrap";
import axios from "axios";

const RecipeDetail = ({ id }) => {
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:6969/recipes/${id}`);
        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setError("Failed to fetch recipe. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <p>Loading recipe...</p>;
  }

  if (error) {
    return <p className='text-danger'>{error}</p>;
  }

  if (!recipe) {
    return <p>Recipe not found</p>;
  }

  return (
    <Container className='recipe-detail'>
      <Card className='recipe-card'>
        <img
          src={recipe.image || "https://via.placeholder.com/150"}
          alt={recipe.title}
          className='recipe-image'
        />
        <CardBody className='recipe-card-body'>
          <CardTitle tag='h1' className='recipe-title'>
            {recipe.title}
          </CardTitle>
          <CardText>
            <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
          </CardText>
          <CardText>
            <strong>Instructions:</strong> {recipe.steps.join("\n")}
          </CardText>
          <CardText>
            <strong>Prep Time:</strong> {recipe.prepTime} minutes
          </CardText>
          <CardText>
            <strong>Cook Time:</strong> {recipe.cookTime} minutes
          </CardText>
          <CardText>
            <strong>Difficulty:</strong> {recipe.difficulty}
          </CardText>
          <CardText>
            <strong>Tags:</strong> {recipe.tags.join(", ")}
          </CardText>
        </CardBody>
      </Card>
    </Container>
  );
};

export default RecipeDetail;
