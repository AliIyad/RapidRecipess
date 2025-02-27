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
import { useAuth } from "../context/AuthContext"; // Firebase authentication context
import api from "../services/authService"; // API service to handle recipe submission

const RecipeForm = ({ setRecipes }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [tags, setTags] = useState("");
  const [recipeImage, setRecipeImage] = useState(null);
  const [feedback, setFeedback] = useState("");

  // Get the user from Firebase authentication context
  const { user, loading } = useAuth();

  // If Firebase is still loading, or user is not authenticated, show an alert or block form submission
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>You must be logged in to submit a recipe.</div>;
  }

  const handleInputFocus = () => setIsFormVisible(true);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setFeedback("Please log in to submit a recipe.");
      return;
    }

    const formData = new FormData();
    formData.append("title", recipeName);
    formData.append("ingredients", ingredients);
    formData.append("steps", instructions);
    formData.append("prepTime", prepTime);
    formData.append("cookTime", cookTime);
    formData.append("difficulty", difficulty);
    formData.append("tags", tags);
    if (recipeImage) {
      formData.append("image", recipeImage);
    }

    try {
      // Make API request to submit the recipe, including Firebase user token in headers
      const response = await api.post("/recipe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${await user.getIdToken()}`, // Attach Firebase token
        },
      });

      // Update recipe list and show feedback message
      setRecipes((prev) => [response.data, ...prev]);
      setFeedback("Thank you! Your recipe has been submitted.");
      resetForm();
    } catch (error) {
      setFeedback(error.response?.data?.message || "Error submitting recipe.");
    }
  };

  const resetForm = () => {
    setRecipeName("");
    setIngredients("");
    setInstructions("");
    setPrepTime("");
    setCookTime("");
    setDifficulty("easy");
    setTags("");
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
          <FormGroup>
            <Label for='recipeName'>Recipe Name</Label>
            <Input
              type='text'
              id='recipeName'
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
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
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for='prepTime'>Prep Time (minutes)</Label>
            <Input
              type='number'
              id='prepTime'
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              min='1'
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for='cookTime'>Cook Time (minutes)</Label>
            <Input
              type='number'
              id='cookTime'
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              min='1'
            />
          </FormGroup>

          <FormGroup>
            <Label for='difficulty'>Difficulty</Label>
            <Input
              type='select'
              id='difficulty'
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}>
              <option value='easy'>Easy</option>
              <option value='medium'>Medium</option>
              <option value='hard'>Hard</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for='tags'>Tags</Label>
            <Input
              type='text'
              id='tags'
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder='Comma-separated tags'
            />
          </FormGroup>

          <FormGroup>
            <Label for='recipeImage'>Recipe Image</Label>
            <Input
              type='file'
              id='recipeImage'
              onChange={(e) => setRecipeImage(e.target.files[0])}
              accept='image/jpeg, image/png'
            />
          </FormGroup>

          <Button type='submit' color='success'>
            Submit Recipe
          </Button>
          <Button
            type='button'
            color='danger'
            onClick={() => setIsFormVisible(false)}>
            Cancel
          </Button>

          {feedback && (
            <Alert
              color={feedback.includes("Thank you") ? "success" : "danger"}>
              {feedback}
            </Alert>
          )}
        </Form>
      )}
    </Container>
  );
};

export default RecipeForm;
