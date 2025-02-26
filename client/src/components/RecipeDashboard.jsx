import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, CardTitle, CardText, Button } from "reactstrap";
import { Link } from "react-router-dom";
import "../CSS/RecipeDashboard.css";

const RecipeDashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Fetch recipes
  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:6969/recipe/paginated?limit=5&skip=${skip}`
      );
      const newRecipes = response.data;

      if (newRecipes.length === 0) {
        setHasMore(false); // No more recipes to load
      } else {
        // Fetch interaction counts for each recipe
        const recipesWithInteractions = await Promise.all(
          newRecipes.map(async (recipe) => {
            const interactionResponse = await axios.get(
              `/interaction/count/recipe/${recipe._id}`
            );
            return {
              ...recipe,
              likeCount: interactionResponse.data.likes,
              dislikeCount: interactionResponse.data.dislikes,
            };
          })
        );

        setRecipes((prevRecipes) => [
          ...prevRecipes,
          ...recipesWithInteractions,
        ]);
        setSkip((prevSkip) => prevSkip + newRecipes.length);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError("Failed to fetch recipes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []); // Fetch initial recipes on component mount

  const handleLoadMore = () => {
    fetchRecipes();
  };

  return (
    <div className='dashboard mt-5'>
      <h2>Recipe Dashboard</h2>
      {error && <p className='text-danger'>{error}</p>}
      <div className='recipe-list'>
        {recipes.length > 0 ? (
          recipes.map((recipe, index) => (
            <div key={index} className='recipe-post'>
              <Link to={`/recipe/${recipe._id}`} className='recipe-link'>
                <Card className='recipe-card'>
                  <img
                    src={recipe.imageUrl || "https://via.placeholder.com/150"}
                    alt={recipe.title}
                    className='recipe-card-image'
                  />
                  <CardBody>
                    <CardTitle tag='h5'>{recipe.title}</CardTitle>
                    <CardText>
                      <strong>Ingredients:</strong>{" "}
                      {recipe.ingredients.join(", ")}
                    </CardText>
                    <CardText>
                      <strong>Prep Time:</strong> {recipe.prepTime} minutes
                    </CardText>
                    <CardText>
                      <strong>Tags:</strong>{" "}
                      {recipe.tags.map((tag) => {
                        tag;
                      })}
                    </CardText>
                    <div className='interaction-meters'>
                      <p>
                        <strong>Likes:</strong> {recipe.likeCount || 0}
                      </p>
                      <p>
                        <strong>Dislikes:</strong> {recipe.dislikeCount || 0}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </div>
          ))
        ) : (
          <p>No recipes submitted yet. Add some recipes!</p>
        )}
      </div>

      {hasMore && (
        <div className='text-center mt-4'>
          <Button color='primary' onClick={handleLoadMore} disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecipeDashboard;
