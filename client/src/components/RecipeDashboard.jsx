import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../services/authService";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Spinner,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../CSS/RecipeDashboard.css";

const RecipeDashboard = ({ userId }) => {
  const { user, loading: userLoading, token, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [preferredTags, setPreferredTags] = useState([]);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    setRecipes([]);
    setPage(1);
    setHasMore(true);
  }, [userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && token) {
        try {
          const response = await api.get("auth/profile");
          setUserData(response.data.user);
          setPreferredTags(response.data.user.preferredTags || []);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user, token]);

  // Helper function to merge recipes and remove duplicates
  const mergeUniqueRecipes = (existingRecipes, newRecipes) => {
    const uniqueRecipes = [...existingRecipes];
    const existingIds = new Set(existingRecipes.map((recipe) => recipe._id));

    newRecipes.forEach((recipe) => {
      if (!existingIds.has(recipe._id)) {
        uniqueRecipes.push(recipe);
      }
    });

    return uniqueRecipes;
  };

  // Fetch recipes with pagination
  const fetchRecipes = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    
    try {
      let endpoint = `recipe?page=${page}&limit=${ITEMS_PER_PAGE}`;

      if (preferredTags.length > 0) {
        endpoint = `recipe/recommended?tagIds=${preferredTags.join(",")}&page=${page}&limit=${ITEMS_PER_PAGE}`;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/${endpoint}`, {
        validateStatus: function (status) {
          return status === 200; // Only treat 200 as success
        }
      });
      
      const newRecipes = response.data;
      if (newRecipes.length === 0) {
        setHasMore(false);
        return;
      }

      setRecipes((prevRecipes) => mergeUniqueRecipes(prevRecipes, newRecipes));
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      // Don't set error state since we're handling empty responses gracefully
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    const initialFetch = async () => {
      setPage(1);
      setRecipes([]);
      setHasMore(true);
      setError(null);
      setLoading(true);
      
      try {
        let endpoint = `recipe?page=1&limit=${ITEMS_PER_PAGE}`;
        if (preferredTags.length > 0) {
          endpoint = `recipe/recommended?tagIds=${preferredTags.join(",")}&page=1&limit=${ITEMS_PER_PAGE}`;
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/${endpoint}`, {
          validateStatus: function (status) {
            return status === 200; // Only treat 200 as success
          }
        });
        
        setRecipes(response.data);
        setPage(2);
        setHasMore(response.data.length === ITEMS_PER_PAGE);
      } catch (error) {
        // Don't set error state or log error since we're handling empty responses gracefully
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    initialFetch();
  }, [preferredTags]);

  const handleLoadMore = () => {
    fetchRecipes();
  };

  const handleInteraction = async (contentType, contentId, reactionType) => {
    if (!isAuthenticated) {
      setError("You must be logged in to like or dislike a recipe.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const response = await api.post("interaction", {
        contentType,
        contentId,
        reactionType,
      });

      const { counts } = response.data;
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe._id === contentId
            ? {
                ...recipe,
                likeCount: counts.likes,
                dislikeCount: counts.dislikes,
              }
            : recipe
        )
      );
    } catch (error) {
      console.error("Error adding interaction:", error);
      setError("Failed to add interaction. Please try again later.");
      setTimeout(() => setError(null), 3000);
    }
  };

  if (userLoading) {
    return (
      <div className='text-center mt-5'>
        <Spinner color='primary' />
      </div>
    );
  }

  return (
    <div className='dashboard mt-5'>
      <h2>Recipe Dashboard</h2>
      {error && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>{error}</strong>
          <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
        </div>
      )}
      <div className='recipe-list'>
        {loading && recipes.length === 0 ? (
          <div className="text-center my-5">
            <Spinner color="primary" />
            <p className="mt-2">Loading recipes...</p>
          </div>
        ) : recipes.length > 0 ? (
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
                    <div className='interaction-meters mt-3'>
                      <Button
                        outline
                        color='primary'
                        size='sm'
                        onClick={(e) => {
                          e.preventDefault();
                          handleInteraction("recipe", recipe._id, "like");
                        }}>
                        Like ({recipe.likeCount || 0})
                      </Button>
                      <Button
                        outline
                        color='secondary'
                        size='sm'
                        className='ms-2'
                        onClick={(e) => {
                          e.preventDefault();
                          handleInteraction("recipe", recipe._id, "dislike");
                        }}>
                        Dislike ({recipe.dislikeCount || 0})
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </div>
          ))
        ) : (
          <p>No recipes found. Be the first to share a recipe!</p>
        )}
      </div>

      {hasMore && recipes.length > 0 && !loading && (
        <div className='text-center mt-4 mb-4'>
          <Button
            color='primary'
            onClick={handleLoadMore}
            disabled={loading}
            className='px-4'>
            {loading ? (
              <>
                <Spinner size='sm' className='me-2' />
                Loading more...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecipeDashboard;
