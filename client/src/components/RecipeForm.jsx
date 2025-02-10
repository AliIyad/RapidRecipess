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

      setRecipes((prevRecipes) => [newRecipe, ...prevRecipes]);
      setFeedback("Thank you! Your recipe has been submitted.");

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

          <FormGroup>
            <Label for='ingredients'>Ingredients</Label>
            <Input
              type='textarea'
              id='ingredients'
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder='List all the ingredients'
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for='instructions'>Instructions</Label>
            <Input
              type='textarea'
              id='instructions'
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder='How to make this delicious dish?'
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for='prepTime'>Preparation Time (in minutes)</Label>
            <Input
              type='number'
              id='prepTime'
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              placeholder='Enter prep time'
              required
              min='1'
            />
          </FormGroup>

          <FormGroup>
            <Label for='recipeImage'>Upload an Image of Your Dish</Label>
            <Input
              type='file'
              id='recipeImage'
              accept='image/*'
              onChange={(e) => setRecipeImage(e.target.files[0])}
            />
          </FormGroup>

          <Button
            type='submit'
            color='success'
            block
            className='buttons-container'
            onClick={handleFormSubmit}>
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
