import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, CardTitle, CardText, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../CSS/RecipeDashboard.css";

const RecipeDashboard = ({ userId }) => {
  const { user, loading: userLoading, token } = useAuth();
  const [userData, setUserData] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [preferredTags, setPreferredTags] = useState([]);

  useEffect(() => {
    setRecipes([]);
    setSkip(0);
    setHasMore(true);
  }, [userId]);

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
          setPreferredTags(response.data.user.preferredTags || []);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user, token]);

  useEffect(() => {
    const fetchUserTags = async () => {
      if (!userData.id) return; // Prevents request if userData.id is not set

      try {
        const response = await axios.get(
          `http://localhost:6969/users/${userData.id}/preferred-tags`
        );
        setPreferredTags(response.data);
      } catch (error) {
        console.error("Error fetching preferred tags:", error);
      }
    };

    fetchUserTags();
  }, [userData.id]); // Runs only when userData.id is available

  // Fetch recipes based on preferred tags
  const fetchRecipes = async () => {
    if (loading || !hasMore || !preferredTags.length) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:6969/recipe/recommended`,
        {
          params: {
            tagIds: preferredTags.join(","), // Pass preferred tags as query params
            limit: 10,
            skip,
          },
        }
      );

      console.log("API Response:", response.data);

      if (!Array.isArray(response.data)) {
        throw new Error(
          `Invalid response format: ${JSON.stringify(response.data)}`
        );
      }

      const newRecipes = response.data;
      if (newRecipes.length === 0) {
        setHasMore(false);
        return;
      }

      setRecipes((prevRecipes) => [...prevRecipes, ...newRecipes]);
      setSkip((prevSkip) => prevSkip + newRecipes.length);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError("Failed to fetch recipes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (preferredTags.length > 0) {
      fetchRecipes();
    }
  }, [preferredTags]);

  return (
    <div className='dashboard mt-5'>
      <h2>Recipe Dashboard</h2>
      {error && <p className='text-danger'>{error}</p>}
      <div className='recipe-list'>
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe._id} className='recipe-post'>
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
                      {recipe.tags?.map((tag) => tag.name).join(", ") ||
                        "No tags"}
                    </CardText>
                    <div className='interaction-meters'>
                      <p>
                        <strong>Likes:</strong> {recipe.likeCount}
                      </p>
                      <p>
                        <strong>Dislikes:</strong> {recipe.dislikeCount}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </div>
          ))
        ) : (
          <p>No recipes found matching your preferences.</p>
        )}
      </div>

      {hasMore && (
        <div className='text-center mt-4'>
          <Button color='primary' onClick={fetchRecipes} disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecipeDashboard;
