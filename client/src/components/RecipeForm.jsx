import React, { useState } from "react";
import {
  Container,
  Form,
  FormGroup,
  Input,
  Button,
  Label,
  Alert,
} from "reactstrap";
import axios from "axios";
import "../CSS/RecipeForm.css";

const RecipeForm = ({ setRecipes }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [recipeImage, setRecipeImage] = useState(null);
  const [feedback, setFeedback] = useState("");

  const handleInputFocus = () => {
    setIsFormVisible(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let validationFeedback = "";

    if (!recipeName || !ingredients || !instructions || !prepTime) {
      validationFeedback = "Please fill out all required fields.";
    } else if (prepTime < 1) {
      validationFeedback = "Preparation time must be at least 1 minute.";
    } else if (
      recipeImage &&
      !["image/jpeg", "image/png", "image/gif"].includes(recipeImage.type)
    ) {
      validationFeedback = "Please upload a valid image file (jpg, png, gif).";
    }

    if (validationFeedback) {
      setFeedback(validationFeedback);
    } else {
      const newRecipe = {
        name: recipeName,
        ingredients,
        instructions,
        prepTime,
        image: recipeImage ? URL.createObjectURL(recipeImage) : null,
        likes: 0, // Default like count
        comments: 0, // Default comment count
      };

      // Send the new recipe to the backend
      axios
        .post("http://localhost:6969/recipes", newRecipe)
        .then((response) => {
          setRecipes((prevRecipes) => [response.data, ...prevRecipes]);
          setFeedback("Thank you! Your recipe has been submitted.");
        })
        .catch((error) => {
          setFeedback("There was an error submitting your recipe.");
          console.error(error);
        });

      setRecipeName("");
      setIngredients("");
      setInstructions("");
      setPrepTime("");
      setRecipeImage(null);
      setTimeout(() => setIsFormVisible(false), 2000);
    }
  };

  return (
    <Container className='home-page mt-5'>
      {!isFormVisible && (
        <div className='text-center'>
          <Input
            type='text'
            placeholder='Up for a snack?'
            onFocus={handleInputFocus}
            className='expandable-input'
          />
        </div>
      )}

      {isFormVisible && (
        <Form onSubmit={handleFormSubmit} className='recipe-form'>
          {/* Form Inputs */}
          <Button
            type='submit'
            color='success'
            block
            className='buttons-container'>
            Submit Recipe
          </Button>

          <Button
            type='button'
            color='danger'
            block
            className='buttons-container'
            onClick={() => setIsFormVisible(false)}>
            Cancel
          </Button>

          {feedback && (
            <Alert
              color={feedback.includes("Thank you") ? "success" : "danger"}
              className='mt-3'>
              {feedback}
            </Alert>
          )}
        </Form>
      )}
    </Container>
  );
};

export default RecipeForm;
