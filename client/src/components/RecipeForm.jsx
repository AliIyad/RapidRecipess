import React, { useState, useEffect } from "react";
import { Form, FormGroup, Input, Button, Label, Alert } from "reactstrap";
import { ChefHat } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../CSS/RecipeForm.css";

const RecipeForm = ({ setRecipes }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    steps: "",
    prepTime: "",
    cookTime: "",
    difficulty: "easy",
    tags: "",
    image: null,
  });
  const [feedback, setFeedback] = useState("");
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    if (feedback) {
      setFeedbackVisible(true);
      const timer = setTimeout(() => setFeedbackVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!user || !user.id) {
        throw new Error("Please log in to submit a recipe.");
      }

      const formPayload = new FormData();
      // Add all form data directly - let server handle the splitting
      formPayload.append('title', formData.title);
      formPayload.append('ingredients', formData.ingredients);
      formPayload.append('steps', formData.steps);
      formPayload.append('prepTime', formData.prepTime);
      formPayload.append('cookTime', formData.cookTime);
      formPayload.append('difficulty', formData.difficulty);
      formPayload.append('tags', formData.tags || ''); // Ensure tags is at least an empty string
      if (formData.image) {
        formPayload.append('image', formData.image);
      }
      formPayload.append('userId', user.id);

      // Log the form data being sent (for debugging)
      console.log('Submitting recipe with data:', {
        title: formData.title,
        ingredients: formData.ingredients,
        steps: formData.steps,
        prepTime: formData.prepTime,
        cookTime: formData.cookTime,
        difficulty: formData.difficulty,
        tags: formData.tags,
        userId: user.id
      });

      const response = await axios.post(
        "http://localhost:6969/recipe",
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecipes((prev) => [response.data, ...prev]);
      setFeedback("Recipe submitted successfully!");
      resetForm();
    } catch (error) {
      console.error("Recipe submission error details:", {
        error: error,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });

      const errorMessage = 
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Error submitting recipe. Please try again.";

      setFeedback(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      ingredients: "",
      steps: "",
      prepTime: "",
      cookTime: "",
      difficulty: "easy",
      tags: "",
      image: null,
    });
    setTimeout(() => setIsFormVisible(false), 1000);
  };

  if (!user) return null;

  return (
    <>
      <div className='recipe-bubble-container'>
        <div className='recipe-bubble' onClick={() => setIsFormVisible(true)}>
          <ChefHat />
          <div className='bubble-tooltip'>Add Recipe</div>
        </div>
      </div>

      <div
        className={`form-overlay ${isFormVisible ? "visible" : ""}`}
        onClick={() => setIsFormVisible(false)}
      />

      {isFormVisible && (
        <Form
          className={`recipe-form ${isFormVisible ? "visible" : ""}`}
          onSubmit={handleSubmit}>
          <h2>Add New Recipe</h2>
          <FormGroup>
            <Label for='title'>Recipe Title</Label>
            <Input
              type='text'
              id='title'
              name='title'
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder='Enter recipe name'
            />
          </FormGroup>

          <FormGroup>
            <Label for='ingredients'>Ingredients (comma-separated)</Label>
            <Input
              type='textarea'
              id='ingredients'
              name='ingredients'
              value={formData.ingredients}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
            <small className='text-muted'>
              Separate ingredients with commas (e.g., 2 cups flour, 1 cup sugar,
              3 eggs)
            </small>
          </FormGroup>

          <FormGroup>
            <Label for='steps'>Steps (one per line)</Label>
            <Input
              type='textarea'
              id='steps'
              name='steps'
              value={formData.steps}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="1. Preheat oven to 350°F&#13;&#10;2. Mix ingredients&#13;&#10;3. Bake for 30 minutes"
              rows={5}
            />
            <small className='text-muted'>Enter each step on a new line (press Enter after each step)</small>
          </FormGroup>

          <div className='form-row'>
            <FormGroup>
              <Label for='prepTime'>Prep Time (minutes)</Label>
              <Input
                type='number'
                id='prepTime'
                name='prepTime'
                value={formData.prepTime}
                onChange={handleChange}
                min='1'
                required
                disabled={isSubmitting}
              />
            </FormGroup>

            <FormGroup>
              <Label for='cookTime'>Cook Time (minutes)</Label>
              <Input
                type='number'
                id='cookTime'
                name='cookTime'
                value={formData.cookTime}
                onChange={handleChange}
                min='1'
                disabled={isSubmitting}
              />
            </FormGroup>
          </div>

          <FormGroup>
            <Label for='difficulty'>Difficulty</Label>
            <Input
              type='select'
              id='difficulty'
              name='difficulty'
              value={formData.difficulty}
              onChange={handleChange}
              disabled={isSubmitting}>
              <option value='easy'>Easy</option>
              <option value='medium'>Medium</option>
              <option value='hard'>Hard</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for='tags'>Tags (comma-separated)</Label>
            <Input
              type='text'
              id='tags'
              name='tags'
              value={formData.tags}
              onChange={handleChange}
              placeholder='breakfast, vegetarian, quick'
              disabled={isSubmitting}
            />
            <small className='text-muted'>
              Separate tags with commas (e.g., vegetarian, dessert, quick)
            </small>
          </FormGroup>

          <FormGroup>
            <Label for='image'>Recipe Image</Label>
            <Input
              type='file'
              id='image'
              name='image'
              onChange={handleChange}
              accept='image/jpeg, image/png'
              disabled={isSubmitting}
            />
          </FormGroup>

          <div className='form-actions'>
            <Button type='submit' color='primary' disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Recipe"}
            </Button>
            <Button
              type='button'
              color='secondary'
              onClick={() => setIsFormVisible(false)}>
              Cancel
            </Button>
          </div>
        </Form>
      )}

      {feedbackVisible && (
        <Alert
          color={feedback.includes("success") ? "success" : "danger"}
          isOpen={feedbackVisible}
          toggle={() => setFeedbackVisible(false)}
          className='feedback-alert'
          fade>
          {feedback}
        </Alert>
      )}
    </>
  );
};

export default RecipeForm;
