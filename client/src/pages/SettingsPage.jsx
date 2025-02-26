import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../CSS/Settings.css";

const Settings = () => {
  const { user: authUser, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [notificationPrefs, setNotificationPrefs] = useState({
    like: false,
    comment: false,
    follow: false,
    message: false,
    friendRequest: false,
    recipeUpdate: false,
  });
  const [preferredTags, setPreferredTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated && authUser.id) {
      axios
        .get(`http://localhost:6969/users/${authUser.id}`)
        .then((response) => {
          setUserData(response.data);
          setNotificationPrefs(response.data.notificationPreferences || {});
          setPreferredTags(response.data.preferredTags || []);
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
    axios
      .get("http://localhost:6969/tags")
      .then((response) => setAvailableTags(response.data))
      .catch((error) => console.error("Error fetching tags:", error));
  }, [isAuthenticated, authUser.id]);

  const handlePrefChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPrefs((prevPrefs) => ({ ...prevPrefs, [name]: checked }));
  };

  const handleTagSelection = (tag) => {
    setPreferredTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const savePreferences = async () => {
    if (!userData) {
      setMessage("User data not loaded. Please try again.");
      return;
    }
    try {
      await axios.put(
        `http://localhost:6969/users/${userData._id}/preferences`,
        {
          notificationPreferences: notificationPrefs,
          preferredTags,
        }
      );
      setMessage("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      setMessage("Failed to save preferences. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>You are not logged in.</div>;
  if (!userData) return <div>Loading user data...</div>;

  return (
    <div className='settings-page'>
      <h1>Settings</h1>
      <div className='settings-section'>
        <h2>Notification Preferences</h2>
        <div className='notification-preferences'>
          {Object.keys(notificationPrefs).map((pref) => (
            <label key={pref}>
              <input
                type='checkbox'
                name={pref}
                checked={notificationPrefs[pref]}
                onChange={handlePrefChange}
              />
              {pref.charAt(0).toUpperCase() + pref.slice(1)}
            </label>
          ))}
        </div>
      </div>
      <div className='settings-section'>
        <h2>Preferred Tags</h2>
        <div className='tag-selection'>
          {availableTags.map((tag) => (
            <button
              key={tag._id}
              className={preferredTags.includes(tag._id) ? "selected" : ""}
              onClick={() => handleTagSelection(tag._id)}>
              {tag.name}
            </button>
          ))}
        </div>
      </div>
      <button onClick={savePreferences}>Save Preferences</button>
      <button onClick={() => navigate("/start")}>Set Prefferred Tags</button>
      {message && <p className='message'>{message}</p>}
      <div className='settings-section'>
        <h2>Account Information</h2>
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
  );
};

export default Settings;
