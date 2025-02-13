import React from "react";
import { useParams } from "react-router-dom";
import { Container, Card, CardBody, CardTitle, CardText } from "reactstrap";

const RecipeDetail = () => {
  const { index } = useParams(); // Get the recipe index from the URL
  //const recipe = JSON.parse(localStorage.getItem("recipes"))[index]; // Retrieve the recipe from localStorage or state

  const recipe = {
    name: "Lasagna",
    ingredients: "Pasta, meat, tomato sauce, cheese",
    instructions: "Cook the pasta, add the sauce, and layer the cheese on top",
    prepTime: 30,
    cookTime: 30,
    overallTime: 60,
    servings: 4,
    calories: 500,
    difficulty: "Medium",
    tags: ["Italian", "Dinner"],
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  };

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
