import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import "../CSS/ProfilePage.css";

const ProfilePage = () => {
  const { user, loading, token } = useAuth(); // Destructure token from context
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // If user is authenticated, fetch user data
    const fetchUserData = async () => {
      if (user && token) {
        // Ensure both user and token are available
        try {
          const response = await axios.get(
            `http://localhost:6969/auth/profile`, // Use user.id from context
            {
              headers: {
                Authorization: `Bearer ${token}`, // Use token from context
              },
            }
          );
          setUserData(response.data.user);
          console.log(response.data.user);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user, token]); // Depend on both user and token

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>You are not logged in</div>;
  }

  return (
    <div className='profile-page'>
      <div className='profile-header'>
        <h1>Welcome, {userData.username}!</h1>
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
            Friend Request:
            {userData.notificationPreferences?.friendRequest ? "Yes" : "No"}
          </li>
          <li>
            Recipe Update:
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
          <p>Followers: {userData.followers?.length}</p>
          <p>Friends: {userData.friends?.length}</p>
        </div>
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
