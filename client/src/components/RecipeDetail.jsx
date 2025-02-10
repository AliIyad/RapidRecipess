import React from "react";
import { useParams } from "react-router-dom";
import { Container, Card, CardBody, CardTitle, CardText } from "reactstrap";

const RecipeDetail = () => {
  const { index } = useParams(); // Get the recipe index from the URL
  const recipe = JSON.parse(localStorage.getItem("recipes"))[index]; // Retrieve the recipe from localStorage or state

  if (!recipe) {
    return <p>Recipe not found</p>;
  }

  return (
    <Container className='recipe-detail mt-5'>
      <Card className='recipe-card'>
        <img
          src={recipe.image || "https://via.placeholder.com/150"}
          alt={recipe.name}
        />
        <CardBody>
          <CardTitle tag='h5'>{recipe.name}</CardTitle>
          <CardText>
            <strong>Ingredients:</strong> {recipe.ingredients}
          </CardText>
          <CardText>
            <strong>Instructions:</strong> {recipe.instructions}
          </CardText>
          <CardText>
            <strong>Prep Time:</strong> {recipe.prepTime} minutes
          </CardText>
        </CardBody>
      </Card>
    </Container>
  );
};

export default RecipeDetail;
