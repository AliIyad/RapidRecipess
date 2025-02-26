import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
} from "reactstrap";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Import the auth context
import api from "../services/authService";

const RecipeDetail = ({ id }) => {
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth(); // Get user and authentication status

  // Fetch recipe details
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:6969/recipe/${id}`);
        setRecipe(response.data);
        fetchInteractionCounts("recipe", id); // Fetch interaction counts for the recipe
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setError("Failed to fetch recipe. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
    fetchInteractionCounts("recipe", id);
  }, [id]);

  // Handle like/dislike interaction for the recipe
  const handleInteraction = async (contentType, contentId, reactionType) => {
    if (!isAuthenticated) {
      setError("You must be logged in to like or dislike a recipe.");
      return;
    }

    try {
      // Optimistically update the UI
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        likeCount:
          reactionType === "like"
            ? prevRecipe.likeCount + 1
            : prevRecipe.likeCount,
        dislikeCount:
          reactionType === "dislike"
            ? prevRecipe.dislikeCount + 1
            : prevRecipe.dislikeCount,
      }));

      // Send the interaction to the backend
      await api.post("/interaction", {
        contentType,
        contentId,
        reactionType,
      });

      // Refetch interaction counts for updated data
      fetchInteractionCounts(contentType, contentId);
    } catch (error) {
      console.error("Error adding interaction:", error);
      setError("Failed to add interaction. Please try again later.");

      // Revert the optimistic update if the request fails
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        likeCount:
          reactionType === "like"
            ? prevRecipe.likeCount - 1
            : prevRecipe.likeCount,
        dislikeCount:
          reactionType === "dislike"
            ? prevRecipe.dislikeCount - 1
            : prevRecipe.dislikeCount,
      }));
    }
  };

  // Fetch interaction counts (like/dislike) for the recipe
  const fetchInteractionCounts = async (contentType, contentId) => {
    try {
      const response = await axios.get(
        `/interaction/count/${contentType}/${contentId}`
      );
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        likeCount: response.data.likes,
        dislikeCount: response.data.dislikes,
      }));
    } catch (error) {
      console.error("Error fetching interaction counts:", error);
    }
  };

  if (loading) {
    return <p className='text-muted'>Loading recipe details...</p>;
  }

  if (error) {
    return <p className='text-danger'>{error}</p>;
  }

  if (!recipe) {
    return (
      <p className='text-danger'>
        Recipe not found. Please check the recipe ID.
      </p>
    );
  }

  return (
    <Container className='recipe-detail'>
      <Card className='recipe-card'>
        <img
          src={recipe.imageUrl || "https://via.placeholder.com/150"}
          alt={recipe.title}
          className='recipe-image'
        />
        <CardBody className='recipe-card-body'>
          <CardTitle tag='h1' className='recipe-title'>
            {recipe.title}
          </CardTitle>
          <CardText>
            <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
          </CardText>
          <CardText>
            <strong>Instructions:</strong>
            <ol>
              {recipe.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </CardText>
          <CardText>
            <strong>Prep Time:</strong> {recipe.prepTime} minutes
          </CardText>
          <CardText>
            <strong>Cook Time:</strong> {recipe.cookTime} minutes
          </CardText>
          <CardText>
            <strong>Difficulty:</strong> {recipe.difficulty}
          </CardText>
          <CardText>
            <strong>Tags:</strong>{" "}
            {recipe.tags && recipe.tags.length > 0
              ? recipe.tags.map((tag) => tag.name).join(", ")
              : "No tags available"}
          </CardText>

          {/* Like/Dislike Buttons */}
          <div className='interaction-buttons mt-3'>
            <Button
              outline
              color='primary'
              size='sm'
              onClick={() => handleInteraction("recipe", recipe._id, "like")}>
              Like ({recipe.likeCount || 0})
            </Button>
            <Button
              outline
              color='secondary'
              size='sm'
              className='ms-2'
              onClick={() =>
                handleInteraction("recipe", recipe._id, "dislike")
              }>
              Dislike ({recipe.dislikeCount || 0})
            </Button>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};

export default RecipeDetail;
