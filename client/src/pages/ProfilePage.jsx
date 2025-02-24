import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";

import "../CSS/ProfilePage.css";

const ProfilePage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      axios
        .get(`http://localhost:6969/users/${user.id}`)
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [isAuthenticated, user.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
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
          <li>
            Like:{" "}
            {userData.notificationPreferences &&
            userData.notificationPreferences.like
              ? "Yes"
              : "No"}
          </li>
          <li>
            Comment:{" "}
            {userData.notificationPreferences &&
            userData.notificationPreferences.comment
              ? "Yes"
              : "No"}
          </li>
          <li>
            Follow:{" "}
            {userData.notificationPreferences &&
            userData.notificationPreferences.follow
              ? "Yes"
              : "No"}
          </li>
          <li>
            Message:{" "}
            {userData.notificationPreferences &&
            userData.notificationPreferences.message
              ? "Yes"
              : "No"}
          </li>
          <li>
            Friend Request:{" "}
            {userData.notificationPreferences &&
            userData.notificationPreferences.friendRequest
              ? "Yes"
              : "No"}
          </li>
          <li>
            Recipe Update:{" "}
            {userData.notificationPreferences &&
            userData.notificationPreferences.recipeUpdate
              ? "Yes"
              : "No"}
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
          <p>Followers: {userData.followers && userData.followers.length}</p>
          <p>Friends: {userData.friends && userData.friends.length}</p>
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
