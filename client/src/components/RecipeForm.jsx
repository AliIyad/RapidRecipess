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
import "../CSS/RecipeForm.css";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const RecipeForm = ({ setRecipes }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [tags, setTags] = useState("");
  const [recipeImage, setRecipeImage] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  const { user, token, loading } = useAuth();
  const [userData, setUserData] = useState(null);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>You must be logged in to submit a recipe.</div>;
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && token) {
        try {
          const response = await axios.get(
            `http://localhost:6969/auth/profile`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUserData(response.data.user);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user, token]);

  useEffect(() => {
    if (feedback) {
      setFeedbackVisible(true);
      const timer = setTimeout(() => {
        setFeedbackVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleInputFocus = () => setIsFormVisible(true);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setFeedback("Please log in to submit a recipe.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append(
      "ingredients",
      ingredients.split(",").map((item) => item.trim())
    );
    formData.append(
      "steps",
      steps.split(".").map((item) => item.trim())
    );
    formData.append("prepTime", prepTime);
    formData.append("cookTime", cookTime);
    formData.append("difficulty", difficulty);
    formData.append(
      "tags",
      tags.split(",").map((item) => item.trim())
    );
    if (recipeImage) {
      formData.append("image", recipeImage);
    }

    try {
      const response = await axios.post(
        "http://localhost:6969/recipe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecipes((prev) => [response.data, ...prev]);
      setFeedback("Thank you! Your recipe has been submitted.");
      resetForm();
    } catch (error) {
      console.error("Error submitting recipe:", error);
      setFeedback(
        error.response?.data?.message ||
          error.response?.statusText ||
          "Error submitting recipe."
      );
    }
  };

  const resetForm = () => {
    setTitle("");
    setIngredients("");
    setSteps("");
    setPrepTime("");
    setCookTime("");
    setDifficulty("easy");
    setTags("");
    setRecipeImage(null);
    setTimeout(() => setIsFormVisible(false), 1000);
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
            <Label for='title'>Recipe Title</Label>
            <Input
              type='text'
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for='ingredients'>Ingredients (comma-separated)</Label>
            <Input
              type='textarea'
              id='ingredients'
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for='steps'>Steps (separated by periods)</Label>
            <Input
              type='textarea'
              id='steps'
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
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
            <Label for='tags'>Tags (comma-separated)</Label>
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

          {feedbackVisible && (
            <Alert
              color={feedback.includes("Thank you") ? "success" : "danger"}
              isOpen={feedbackVisible}
              toggle={() => setFeedbackVisible(false)}
              fade={true}>
              {feedback}
            </Alert>
          )}
        </Form>
      )}
    </Container>
  );
};

export default RecipeForm;
