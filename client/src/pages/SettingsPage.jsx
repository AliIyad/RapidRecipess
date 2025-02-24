import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

import "../CSS/Settings.css";

const Settings = () => {
  const { user: authUser, isAuthenticated, loading } = useAuth();
  const [userData, setUserData] = useState(null); // Store fetched user data
  const [notificationPrefs, setNotificationPrefs] = useState({
    like: false,
    comment: false,
    follow: false,
    message: false,
    friendRequest: false,
    recipeUpdate: false,
  });
  const [message, setMessage] = useState("");

  // Fetch user data when the component mounts
  useEffect(() => {
    if (isAuthenticated && authUser.id) {
      axios
        .get(`http://localhost:6969/users/${authUser.id}`)
        .then((response) => {
          setUserData(response.data);
          setNotificationPrefs(
            response.data.notificationPreferences || {
              like: false,
              comment: false,
              follow: false,
              message: false,
              friendRequest: false,
              recipeUpdate: false,
            }
          );
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [isAuthenticated, authUser.id]);

  // Handle changes to notification preferences
  const handlePrefChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPrefs((prevPrefs) => ({
      ...prevPrefs,
      [name]: checked,
    }));
  };

  // Save updated preferences to the server
  const savePreferences = async () => {
    if (!userData) {
      setMessage("User data not loaded. Please try again.");
      return;
    }

    try {
      console.log("Saving preferences:", notificationPrefs);
      console.log("User ID:", userData._id);

      const response = await axios.put(
        `http://localhost:6969/users/${userData._id}/notification-preferences`,
        { notificationPreferences: notificationPrefs }
      );

      console.log("Backend response:", response.data);
      setMessage("Preferences saved successfully!");
    } catch (error) {
      console.error(
        "Error saving preferences:",
        error.response?.data || error.message
      );
      setMessage("Failed to save preferences. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>You are not logged in.</div>;
  }

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className='settings-page'>
      <h1>Settings</h1>
      <div className='settings-section'>
        <h2>Notification Preferences</h2>
        <div className='notification-preferences'>
          <label>
            <input
              type='checkbox'
              name='like'
              checked={notificationPrefs.like}
              onChange={handlePrefChange}
            />
            Likes
          </label>
          <label>
            <input
              type='checkbox'
              name='comment'
              checked={notificationPrefs.comment}
              onChange={handlePrefChange}
            />
            Comments
          </label>
          <label>
            <input
              type='checkbox'
              name='follow'
              checked={notificationPrefs.follow}
              onChange={handlePrefChange}
            />
            Follows
          </label>
          <label>
            <input
              type='checkbox'
              name='message'
              checked={notificationPrefs.message}
              onChange={handlePrefChange}
            />
            Messages
          </label>
          <label>
            <input
              type='checkbox'
              name='friendRequest'
              checked={notificationPrefs.friendRequest}
              onChange={handlePrefChange}
            />
            Friend Requests
          </label>
          <label>
            <input
              type='checkbox'
              name='recipeUpdate'
              checked={notificationPrefs.recipeUpdate}
              onChange={handlePrefChange}
            />
            Recipe Updates
          </label>
        </div>
        <button onClick={savePreferences}>Save Preferences</button>
        {message && <p className='message'>{message}</p>}
      </div>

      <div className='settings-section'>
        <h2>Account Information</h2>
        <div className='account-info'>
          <p>
            <strong>Username:</strong> {userData.username}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Verified:</strong> {userData.verified ? "Yes" : "No"}
          </p>
          <p>
            <strong>User Since:</strong>{" "}
            {new Date(userData.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
