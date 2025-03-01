import React, { useState } from "react";
import {
  Container,
  Form,
  FormGroup,
  Input,
  Button,
  Label,
  Alert,
  Spinner,
} from "reactstrap";
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
  const [difficulty, setDifficulty] = useState("easy");
  const [tags, setTags] = useState("");
  const [recipeImage, setRecipeImage] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner color="primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <Alert color="warning" className="m-3">
        You must be logged in to submit a recipe.
      </Alert>
    );
  }

  const handleInputFocus = () => setIsFormVisible(true);

  const validateForm = () => {
    if (!recipeName.trim()) {
      setFeedback("Recipe name is required");
      return false;
    }
    if (!ingredients.trim()) {
      setFeedback("Ingredients are required");
      return false;
    }
    if (!instructions.trim()) {
      setFeedback("Instructions are required");
      return false;
    }
    if (!prepTime || prepTime <= 0) {
      setFeedback("Valid prep time is required");
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setFeedback("");

    try {
      const formData = new FormData();
      formData.append("title", recipeName.trim());
      formData.append("ingredients", ingredients.trim());
      formData.append("steps", instructions.trim());
      formData.append("prepTime", prepTime);
      formData.append("cookTime", cookTime || "0");
      formData.append("difficulty", difficulty);
      
      // Handle tags - remove empty tags and extra spaces
      const cleanedTags = tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "")
        .join(",");
      formData.append("tags", cleanedTags);

      if (recipeImage) {
        formData.append("image", recipeImage);
      }

      console.log('Submitting recipe with data:', {
        title: recipeName,
        ingredients,
        steps: instructions,
        prepTime,
        cookTime,
        difficulty,
        tags: cleanedTags,
        hasImage: !!recipeImage
      });

      const response = await api.post("/recipe", formData);

      console.log('Recipe submission response:', response.data);

      setRecipes((prev) => [response.data, ...prev]);
      setFeedback("Thank you! Your recipe has been submitted successfully.");
      resetForm();
    } catch (error) {
      console.error("Recipe submission error:", error);
      
      const errorMessage = error.response?.data?.message 
        || error.message 
        || "Error submitting recipe. Please try again.";
      
      setFeedback(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
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
    <Container className="home-page mt-5">
      {!isFormVisible && (
        <div className="text-center">
          <Input
            type="text"
            placeholder="Share your recipe..."
            onFocus={handleInputFocus}
            className="expandable-input"
          />
        </div>
      )}

      {isFormVisible && (
        <Form onSubmit={handleFormSubmit} className="recipe-form">
          <FormGroup>
            <Label for="recipeName">Recipe Name *</Label>
            <Input
              type="text"
              id="recipeName"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Enter recipe name"
            />
          </FormGroup>

          <FormGroup>
            <Label for="ingredients">Ingredients *</Label>
            <Input
              type="textarea"
              id="ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Enter ingredients separated by commas"
              rows="5"
              required
              disabled={isSubmitting}
            />
            <small className="text-muted">
              Separate ingredients with commas (e.g., 2 cups flour, 1 cup sugar, 3 eggs)
            </small>
          </FormGroup>

          <FormGroup>
            <Label for="instructions">Instructions *</Label>
            <Input
              type="textarea"
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter instructions step by step"
              rows="5"
              required
              disabled={isSubmitting}
            />
            <small className="text-muted">
              Enter each step on a new line
            </small>
          </FormGroup>

          <FormGroup>
            <Label for="prepTime">Prep Time (minutes) *</Label>
            <Input
              type="number"
              id="prepTime"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              min="1"
              required
              disabled={isSubmitting}
            />
          </FormGroup>

          <FormGroup>
            <Label for="cookTime">Cook Time (minutes)</Label>
            <Input
              type="number"
              id="cookTime"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              min="0"
              disabled={isSubmitting}
            />
          </FormGroup>

          <FormGroup>
            <Label for="difficulty">Difficulty</Label>
            <Input
              type="select"
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              disabled={isSubmitting}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="tags">Tags</Label>
            <Input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., vegetarian, dessert, quick"
              disabled={isSubmitting}
            />
            <small className="text-muted">
              Separate tags with commas (e.g., vegetarian, dessert, quick)
            </small>
          </FormGroup>

          <FormGroup>
            <Label for="recipeImage">Recipe Image</Label>
            <Input
              type="file"
              id="recipeImage"
              onChange={(e) => setRecipeImage(e.target.files[0])}
              accept="image/jpeg, image/png"
              disabled={isSubmitting}
            />
          </FormGroup>

          <div className="d-flex gap-2 mt-4">
            <Button 
              type="submit" 
              color="success" 
              disabled={isSubmitting}
              className="px-4"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Submitting...
                </>
              ) : (
                'Submit Recipe'
              )}
            </Button>
            <Button
              type="button"
              color="secondary"
              onClick={() => setIsFormVisible(false)}
              disabled={isSubmitting}>
              Cancel
            </Button>
          </div>

          {feedback && (
            <Alert
              color={feedback.includes("successfully") ? "success" : "danger"}
              className="mt-3"
              fade={false}
            >
              {feedback}
            </Alert>
          )}
        </Form>
      )}
    </Container>
  );
};

export default RecipeForm;
