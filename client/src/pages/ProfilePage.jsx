import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import "../CSS/ProfilePage.css";

const ProfilePage = () => {
  const { user, loading, token } = useAuth();
  const [userData, setUserData] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

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
          setError("Failed to fetch user data. Please try again.");
        }
      }
    };

    fetchUserData();
  }, [user, token]);

  useEffect(() => {
    const fetchUserRecipes = async () => {
      if (user && token) {
        try {
          // Use userData.id since that's where the ID is stored
          const response = await axios.get(
            `http://localhost:6969/recipe/user/${userData.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setRecipes(response.data.recipes);
        } catch (error) {
          console.error("Error fetching user recipes:", error);
          setError("Failed to fetch your recipes. Please try again.");
        }
      }
    };

    fetchUserRecipes();
  }, [user, token, userData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>You are not logged in</div>;
  }

  return (
    <div className='profile-page'>
      {error && <div className='alert alert-danger mt-3'>{error}</div>}

      <div className='profile-header'>
        <h1>Welcome, {userData.username || userData.email}!</h1>
        <p>Email: {userData.email}</p>
        <p>Verified: {userData.verified ? "Yes" : "No"}</p>
      </div>

      <div className='profile-section'>
        <h2>Notification Preferences</h2>
        <ul>
          <li>Like: {userData.notificationPreferences?.like ? "Yes" : "No"}</li>
          <li>
            Comment: {userData.notificationPreferences?.comment ? "Yes" : "No"}
          </li>
          <li>
            Follow: {userData.notificationPreferences?.follow ? "Yes" : "No"}
          </li>
          <li>
            Message: {userData.notificationPreferences?.message ? "Yes" : "No"}
          </li>
          <li>
            Friend Request:{" "}
            {userData.notificationPreferences?.friendRequest ? "Yes" : "No"}
          </li>
          <li>
            Recipe Update:{" "}
            {userData.notificationPreferences?.recipeUpdate ? "Yes" : "No"}
          </li>
        </ul>
        <Link to={`/settings`}>
          <Button color='primary' className='btn-block'>
            Edit Notification Preferences
          </Button>
        </Link>
      </div>

      <div className='profile-section'>
        <h2>Followers and Friends</h2>
        <div className='stats'>
          <p>Followers: {userData.followers?.length || 0}</p>
          <p>Friends: {userData.friends?.length || 0}</p>
        </div>
      </div>

      <div className='profile-section'>
        <h2>Personal Recipes</h2>
        {recipes.length === 0 ? (
          <p>No recipes found. Why not create one?</p>
        ) : (
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                <Link to={`/recipe/${recipe.id}`}>{recipe.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className='profile-section'>
        <h2>Account Information</h2>
        <div className='account-info'>
          <p>User Since: {new Date(userData.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
