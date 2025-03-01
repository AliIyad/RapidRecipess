import React, { useState, useEffect } from "react";
import { Form, FormGroup, Input, Button, Label, Alert } from "reactstrap";
import { ChefHat } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../CSS/RecipeForm.css";

const RecipeForm = ({ setRecipes }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
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
    if (!user) {
      setFeedback("Please log in to submit a recipe.");
      return;
    }

    const formPayload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "ingredients" || key === "steps" || key === "tags") {
        formPayload.append(
          key,
          formData[key].split(",").map((item) => item.trim())
        );
      } else {
        formPayload.append(key, formData[key]);
      }
    });

    try {
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
      console.error("Recipe submission error:", error);

      const errorMessage =
        error.response?.data?.message ||
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
            <Label for='steps'>Steps (separated by periods)</Label>
            <Input
              type='textarea'
              id='steps'
              name='steps'
              value={formData.steps}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
            <small className='text-muted'>Enter each step on a new line</small>
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
              onChange={handleChange}>
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
            />
          </FormGroup>

          <div className='form-actions'>
            <Button type='submit' color='primary'>
              Submit Recipe
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
          className='feedback-alert'>
          {feedback}
        </Alert>
      )}
    </>
  );
};

export default RecipeForm;
