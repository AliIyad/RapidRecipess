import React, { useState, useEffect } from "react";
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
import { useAuth } from "../context/AuthContext";
import api from "../services/authService";

const RecipeForm = ({ setRecipes }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [tags, setTags] = useState("");
  const [recipeImage, setRecipeImage] = useState(null);
  const [feedback, setFeedback] = useState("");
  const { user, isAuthenticated, loading } = useAuth();
  const [userData, setUserData] = useState(null);

  const data = userData ? JSON.stringify(userData) : null;

  useEffect(() => {
    if (isAuthenticated) {
      axios
        .get(`http://localhost:6969/users/${user.id}`)
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [isAuthenticated, user.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>You are not logged in</div>;
  }

  const handleInputFocus = () => {
    setIsFormVisible(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setFeedback("Please log in to submit a recipe.");
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("title", recipeName);
    formData.append("ingredients", ingredients);
    formData.append("steps", instructions);
    formData.append("prepTime", prepTime);
    formData.append("cookTime", cookTime);
    formData.append("difficulty", difficulty.toLocaleLowerCase());
    formData.append("tags", tags);
    if (recipeImage) {
      formData.append("image", recipeImage);
    }

    // Send the new recipe to the backend
    try {
      const response = await api.post("/recipe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setRecipes((prevRecipes) => [response.data, ...prevRecipes]);
      setFeedback("Thank you! Your recipe has been submitted.");
      resetForm();
    } catch (error) {
      setFeedback(
        error.response?.data?.message ||
          "There was an error submitting your recipe."
      );
      console.error("Error submitting recipe:", error);
    }
  };

  const resetForm = () => {
    setRecipeName("");
    setIngredients("");
    setInstructions("");
    setPrepTime("");
    setCookTime("");
    setDifficulty("");
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
          {/* Cooking Time */}
          <FormGroup>
            <Label for='cookTime'>Cooking Time (minutes)</Label>
            <Input
              type='number'
              id='cookTime'
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              placeholder='Enter cooking time'
              min='1'
            />
          </FormGroup>

          {/* Difficulty */}
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

          {/* Tags */}
          <FormGroup>
            <Label for='tags'>Tags</Label>
            <Input
              type='text'
              id='tags'
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder='Enter tags (comma-separated)'
            />
          </FormGroup>

          {/* Recipe Image */}
          <FormGroup>
            <Label for='recipeImage'>Recipe Image</Label>
            <Input
              type='file'
              id='recipeImage'
              onChange={(e) => setRecipeImage(e.target.files[0])}
              accept='image/jpeg, image/png'
            />
            <small className='text-muted'>
              Upload a JPG or PNG file (max 5MB).
            </small>
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
