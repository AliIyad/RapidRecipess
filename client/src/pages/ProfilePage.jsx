import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { Camera, Settings, Edit, Users, ChefHat, Bell } from "lucide-react";
import "../CSS/ProfilePage.css";

const ProfilePage = () => {
  const { user, loading, token } = useAuth();
  const [userData, setUserData] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [preferredTags, setPreferredTags] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditingProfilePicture, setIsEditingProfilePicture] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUserData();
    fetchAvailableTags();
    fetchUserRecipes();
  }, [user, token]);

  const fetchUserData = async () => {
    if (user && token) {
      try {
        const response = await axios.get(`http://localhost:6969/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data.user);
        setPreferredTags(response.data.user.preferredTags || []);
        setProfilePicture(response.data.user.profilePicture || null);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data");
      }
    }
  };

  const fetchAvailableTags = async () => {
    try {
      const response = await axios.get("http://localhost:6969/tags");
      setAvailableTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
      setError("Failed to fetch tags");
    }
  };

  const fetchUserRecipes = async () => {
    if (user && token && userData.id) {
      try {
        const response = await axios.get(
          `http://localhost:6969/recipe/user/${userData.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecipes(response.data.recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setError("Failed to fetch recipes");
      }
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsEditingProfilePicture(true);

      const formData = new FormData();
      formData.append("profilePicture", file);

      try {
        const response = await axios.put(
          `http://localhost:6969/users/${userData.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setProfilePicture(response.data.profilePicture);
        setIsEditingProfilePicture(false);
        setSelectedFile(null);
      } catch (error) {
        console.error("Error updating profile picture:", error);
        setError("Failed to update profile picture");
        setIsEditingProfilePicture(false);
      }
    }
  };

  if (loading) return <div className='loading-screen'>Loading...</div>;
  if (!user)
    return (
      <div className='error-screen'>Please log in to view your profile</div>
    );

  return (
    <div className='profile-page'>
      <div className='profile-header'>
        <div className='profile-picture-container'>
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={`${userData.username}'s profile`}
              className='profile-picture'
            />
          ) : (
            <div className='default-avatar'>
              {userData.username || userData.email}
            </div>
          )}

          <div
            className='update-picture-overlay'
            onClick={() => fileInputRef.current?.click()}>
            <Camera size={24} />
          </div>

          <input
            ref={fileInputRef}
            type='file'
            className='profile-picture-input'
            accept='image/*'
            onChange={handleFileChange}
          />

          {isEditingProfilePicture && <div className='upload-progress' />}
        </div>

        <h1>{userData.username || userData.email}</h1>
        <p className='user-email'>{userData.email}</p>
        <div className='verification-badge'>
          {userData.verified ? "Verified Account" : "Unverified Account"}
        </div>
      </div>

      <div className='profile-sections-grid'>
        <div className='profile-section'>
          <div className='section-header'>
            <Bell size={20} />
            <h2>Notifications</h2>
          </div>
          <div className='notification-preferences'>
            {Object.entries(userData.notificationPreferences || {}).map(
              ([key, value]) => (
                <div key={key} className='preference-item'>
                  <span className='preference-label'>{key}</span>
                  <span
                    className={`preference-value ${
                      value ? "enabled" : "disabled"
                    }`}>
                    {value ? "Enabled" : "Disabled"}
                  </span>
                </div>
              )
            )}
          </div>
          <Link to='/settings' className='section-link'>
            <Settings size={16} />
            Manage Notifications
          </Link>
        </div>

        <div className='profile-section'>
          <div className='section-header'>
            <Edit size={20} />
            <h2>Preferred Tags</h2>
          </div>
          <div className='tag-cloud'>
            {preferredTags.length > 0 ? (
              preferredTags.map((tagId) => {
                const tag = availableTags.find((t) => t._id === tagId);
                return tag ? (
                  <span key={tag._id} className='tag'>
                    {tag.name}
                  </span>
                ) : null;
              })
            ) : (
              <p className='empty-state'>No preferred tags selected</p>
            )}
          </div>
          <Link to='/settings' className='section-link'>
            <Settings size={16} />
            Manage Tags
          </Link>
        </div>

        <div className='profile-section'>
          <div className='section-header'>
            <ChefHat size={20} />
            <h2>My Recipes</h2>
          </div>
          <div className='recipe-list'>
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <Link
                  key={recipe._id}
                  to={`/recipe/${recipe._id}`}
                  className='recipe-item'>
                  <span className='recipe-title'>{recipe.title}</span>
                </Link>
              ))
            ) : (
              <p className='empty-state'>No recipes created yet</p>
            )}
          </div>
        </div>

        <div className='profile-section'>
          <div className='section-header'>
            <Users size={20} />
            <h2>Community</h2>
          </div>
          <div className='stats'>
            <div className='stat-card'>
              <span className='stat-number'>
                {userData.followers?.length || 0}
              </span>
              <span className='stat-label'>Followers</span>
            </div>
            <div className='stat-card'>
              <span className='stat-number'>
                {userData.friends?.length || 0}
              </span>
              <span className='stat-label'>Friends</span>
            </div>
          </div>
        </div>
      </div>

      {error && <div className='error-message'>{error}</div>}
    </div>
  );
};

export default ProfilePage;
