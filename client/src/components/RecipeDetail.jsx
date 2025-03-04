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
import { useAuth } from "../context/AuthContext"; // Import the auth context
import api from "../services/authService";

const RecipeDetail = ({ id }) => {
  const [recipe, setRecipe] = useState({ tags: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth(); // Get user and authentication status

  // Fetch recipe details
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await api.get(`recipe/${id}`);
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

  useEffect(() => {
    const fetchRecipeTags = async () => {
      try {
        const response = await api.get(`tags/recipe/${id}`);

        // Check if the response contains an array of tags
        if (Array.isArray(response.data)) {
          setRecipe((prevRecipe) => ({
            ...prevRecipe,
            tags: response.data, // Make sure this is an array of tags
          }));
        } else {
          console.error("Received tags are not in array format", response.data);
        }
      } catch (error) {
        console.error("Error fetching recipe tags:", error);
      }
    };

    fetchRecipeTags();
  }, [id]);

  // Handle like/dislike interaction for the recipe
  const handleInteraction = async (contentType, contentId, reactionType) => {
    if (!isAuthenticated) {
      setError("You must be logged in to like or dislike a recipe.");
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const response = await api.post("interaction", {
        contentType,
        contentId,
        reactionType,
      });

      // Update counts based on server response
      const { counts } = response.data;
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        likeCount: counts.likes,
        dislikeCount: counts.dislikes
      }));

    } catch (error) {
      console.error("Error adding interaction:", error);
      setError("Failed to add interaction. Please try again later.");
    }
  };

  // Fetch interaction counts (like/dislike) for the recipe
  const fetchInteractionCounts = async (contentType, contentId) => {
    try {
      const response = await api.get(
        `interaction/count/${contentType}/${contentId}`
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
    return (
      <div className="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>{error}</strong>
        <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
      </div>
    );
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
        <div className='recipe-image-container'>
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className='recipe-image'
          />
        </div>
        <CardBody className='recipe-card-body'>
          <CardTitle tag='h1' className='recipe-title'>
            {recipe.title}
          </CardTitle>
          <CardText>
            <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
          </CardText>
          <CardText>
            <strong>Instructions:</strong>
          </CardText>
          <ol>
            {Array.isArray(recipe.steps) ? (
              recipe.steps.map((step, index) => (
                <li key={recipe._id || Math.random()}>
                  {step} <br />
                </li>
              ))
            ) : (
              <p className='text-muted'>No steps available</p>
            )}
          </ol>
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
            <strong>Tags: </strong>
            {recipe.tags ? (
              recipe.tags.map((tag) => (
                <span key={tag._id || Math.random()} className='tag'>
                  {tag.name}
                  {"\n"}
                </span>
              ))
            ) : (
              <span className='text-muted'>No tags available</span>
            )}
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
