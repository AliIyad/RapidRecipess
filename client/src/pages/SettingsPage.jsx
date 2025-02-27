import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Button, Label, Input } from "reactstrap";
import "../CSS/Settings.css";

const Settings = () => {
  const { user, loading, token } = useAuth();
  const [userData, setUserData] = useState({});
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

    const fetchAvailableTags = async () => {
      try {
        const response = await axios.get("http://localhost:6969/tags");
        setAvailableTags(response.data);
      } catch (error) {
        console.error("Error fetching available tags:", error);
      }
    };

    fetchUserData();
    fetchAvailableTags();
  }, [user, token]);

  const handlePrefChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPrefs((prevPrefs) => ({ ...prevPrefs, [name]: checked }));
  };

  const handleTagSelection = (tagId) => {
    setPreferredTags((prevTags) =>
      prevTags.includes(tagId)
        ? prevTags.filter((t) => t !== tagId)
        : [...prevTags, tagId]
    );
  };

  const saveNotificationPreferences = async () => {
    if (!userData) {
      setMessage("User data not loaded. Please try again.");
      return;
    }
    try {
      await axios.put(
        `http://localhost:6969/users/${userData.id}/notification-preferences`,
        {
          notificationPreferences: notificationPrefs,
          preferredTags,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      setMessage("Failed to save preferences. Please try again.");
    }
  };

  const saveTagPreferences = async () => {
    if (!userData) {
      setMessage("User data not loaded. Please try again.");
      return;
    }
    try {
      await axios.put(
        `http://localhost:6969/users/${userData.id}/preferred-tags`,
        {
          preferredTags,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Tag preferences saved successfully!");
    } catch (error) {
      console.error("Error saving tag preferences:", error);
      setMessage("Failed to save tag preferences. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>You are not logged in.</div>;
  if (!userData) return <div>Loading user data...</div>;

  return (
    <div className='settings-page'>
      <div className='profile-header'>
        <h1>Welcome, {userData.username}!</h1>
        <p>Email: {userData.email}</p>
        <p>Verified: {userData.verified ? "Yes" : "No"}</p>
      </div>

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
        <Button
          color='primary'
          onClick={saveNotificationPreferences}
          className='btn-block'>
          Save Notification Preferences
        </Button>
      </div>

      <div className='settings-section'>
        <h2>Preferred Tags</h2>
        <div className='tag-preferences'>
          {availableTags.map((tag) => (
            <Label key={tag._id} check>
              <Input
                type='checkbox'
                name={tag._id}
                checked={preferredTags.includes(tag._id)}
                onChange={() => handleTagSelection(tag._id)}
              />
              {tag.name}
            </Label>
          ))}
        </div>
        <Button
          color='primary'
          onClick={saveTagPreferences}
          className='btn-block'>
          Save Tag Preferences
        </Button>
      </div>

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
