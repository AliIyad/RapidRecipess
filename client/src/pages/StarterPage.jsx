import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Button, FormGroup, Label, Input } from "reactstrap";
import { Link } from "react-router-dom";
import "../CSS/Starter.css"; // Use the same CSS file for consistent styling

const StarterPage = ({ onComplete }) => {
  const { user, loading, token } = useAuth();
  const [userData, setUserData] = useState({});
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:6969/tags");
        setAvailableTags(response.data);
      } catch (error) {
        console.error("Error fetching available tags:", error);
      }
    };

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
          setSelectedTags(response.data.user.preferredTags || []);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchTags();
    fetchUserData();
  }, [user, token]);

  const toggleTagSelection = (tagId) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagId)
        ? prevTags.filter((id) => id !== tagId)
        : [...prevTags, tagId]
    );
  };

  const savePreferences = async () => {
    if (!userData?.id || !token) return;

    try {
      await axios.put(
        `http://localhost:6969/users/${userData.id}/preferred-tags`,
        {
          preferredTags: selectedTags,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Preferences saved successfully!");
      if (onComplete) onComplete();
    } catch (error) {
      console.error("Error saving preferences:", error);
      setMessage("Failed to save preferences. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user)
    return (
      <div>
        You need to log in to set preferences.{" "}
        <Button onClick={() => logout()}>Log out</Button>
      </div>
    );

  return (
    <div className='settings-page'>
      <div className='profile-header'>
        <h1>Welcome, {userData.username}!</h1>
        <p>Email: {userData.email}</p>
        <p>Verified: {userData.verified ? "Yes" : "No"}</p>
      </div>

      <div className='settings-section'>
        <h2>Choose Your Interests</h2>
        <div className='tag-selection'>
          {availableTags.map((tag) => (
            <FormGroup check key={tag._id} className='tag-item'>
              <Label check>
                <Input
                  type='checkbox'
                  checked={selectedTags.includes(tag._id)}
                  onChange={() => toggleTagSelection(tag._id)}
                />
                {tag.name}
              </Label>
            </FormGroup>
          ))}
        </div>
        {message && <p className='message'>{message}</p>}
        <Button color='primary' onClick={savePreferences} className='btn-block'>
          Save Preferences
        </Button>
        <Button
          color='secondary'
          className='btn-block'
          tag={Link}
          to='/settings'>
          Go Back to Settings?
        </Button>
      </div>
    </div>
  );
};

export default StarterPage;
