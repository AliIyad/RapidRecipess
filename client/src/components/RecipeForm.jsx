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

    // Validation
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
        ingredients: ingredients
          .split(",")
          .map((ingredient) => ingredient.trim()), // Convert to array
        instructions: instructions.split("\n"), // Convert to array
        prepTime: parseInt(prepTime, 10),
        image: recipeImage ? URL.createObjectURL(recipeImage) : null,
        likes: 0, // Default like count
        comments: [], // Default empty comments array
      };

      // Send the new recipe to the backend
      axios
        .post("http://localhost:6969/recipes", newRecipe)
        .then((response) => {
          setRecipes((prevRecipes) => [response.data, ...prevRecipes]);
          setFeedback("Thank you! Your recipe has been submitted.");
          resetForm();
        })
        .catch((error) => {
          setFeedback("There was an error submitting your recipe.");
          console.error(error);
        });
    }
  };

  const resetForm = () => {
    setRecipeName("");
    setIngredients("");
    setInstructions("");
    setPrepTime("");
    setRecipeImage(null);
    setTimeout(() => setIsFormVisible(false), 2000);
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
          {/* Recipe Name */}
          <FormGroup>
            <Label for='recipeName'>Recipe Name</Label>
            <Input
              type='text'
              id='recipeName'
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              placeholder='Enter recipe name'
              required
            />
          </FormGroup>

          {/* Ingredients */}
          <FormGroup>
            <Label for='ingredients'>Ingredients</Label>
            <Input
              type='textarea'
              id='ingredients'
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder='Enter ingredients (comma-separated)'
              required
            />
          </FormGroup>

          {/* Instructions */}
          <FormGroup>
            <Label for='instructions'>Instructions</Label>
            <Input
              type='textarea'
              id='instructions'
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder='Enter instructions (one step per line)'
              required
            />
          </FormGroup>

          {/* Preparation Time */}
          <FormGroup>
            <Label for='prepTime'>Preparation Time (minutes)</Label>
            <Input
              type='number'
              id='prepTime'
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              placeholder='Enter preparation time'
              min='1'
              required
            />
          </FormGroup>

          {/* Recipe Image */}
          <FormGroup>
            <Label for='recipeImage'>Recipe Image</Label>
            <Input
              type='file'
              id='recipeImage'
              onChange={(e) => setRecipeImage(e.target.files[0])}
              accept='image/jpeg, image/png, image/gif'
            />
          </FormGroup>

          {/* Buttons */}
          <Button type='submit' color='success' className='buttons-container'>
            Submit Recipe
          </Button>

          <Button
            type='button'
            color='danger'
            className='buttons-container'
            onClick={() => setIsFormVisible(false)}>
            Cancel
          </Button>

          {/* Feedback Message */}
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
