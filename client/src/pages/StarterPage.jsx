import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Button } from "reactstrap";
import "../CSS/Starter.css";

const StarterPage = () => {
  const { user: authUser, isAuthenticated, loading } = useAuth();
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:6969/tags")
      .then((response) => {
        setAvailableTags(response.data);
      })
      .catch((error) => console.error("Error fetching tags:", error));
  }, []);

  useEffect(() => {
    if (isAuthenticated && authUser.id) {
      axios
        .get(`http://localhost:6969/users/${authUser.id}`)
        .then((response) => {
          setSelectedTags(response.data.preferredTags || []);
        })
        .catch((error) =>
          console.error("Error fetching user preferences:", error)
        );
    }
  }, [isAuthenticated, authUser.id]);

  const toggleTagSelection = (tagId) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagId)
        ? prevTags.filter((id) => id !== tagId)
        : [...prevTags, tagId]
    );
  };

  const savePreferences = async () => {
    if (!authUser.id) return;

    try {
      await axios.put(
        `http://localhost:6969/users/${authUser.id}/preferred-tags`,
        {
          preferredTags: selectedTags,
        }
      );
      setMessage("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      setMessage("Failed to save preferences. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated)
    return <div>You need to log in to set preferences.</div>;

  return (
    <div className='starter-page'>
      <h1>Choose Your Interests</h1>
      <div className='tag-grid'>
        {availableTags.map((tag) => (
          <div
            key={tag._id}
            className={`tag-item ${
              selectedTags.includes(tag._id) ? "selected" : ""
            }`}
            onClick={() => toggleTagSelection(tag._id)}>
            {tag.name}
          </div>
        ))}
      </div>
      <Button color='primary' onClick={savePreferences}>
        Save Preferences
      </Button>
      {message && <p className='message'>{message}</p>}
    </div>
  );
};

export default StarterPage;
