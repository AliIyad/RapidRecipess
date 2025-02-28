import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Button, Label, Input } from "reactstrap";
import { Bell, Tags, User, Shield } from "lucide-react"; // Import icons
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
      <div className='settings-header'>
        <h1>Settings</h1>
        <p>Manage your account preferences</p>
      </div>

      {/* Account Information Section */}
      <div className='settings-section'>
        <div className='section-header'>
          <User size={20} />
          <h2>Account Information</h2>
        </div>
        <div className='account-info'>
          <div className='info-item'>
            <strong>Username</strong>
            <span>{userData.username}</span>
          </div>
          <div className='info-item'>
            <strong>Email</strong>
            <span>{userData.email}</span>
          </div>
          <div className='info-item'>
            <strong>Verified</strong>
            <span>{userData.verified ? "Yes" : "No"}</span>
          </div>
          <div className='info-item'>
            <strong>Member Since</strong>
            <span>{new Date(userData.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Verification Section */}
      <div className='settings-section'>
        <div className='section-header'>
          <Shield size={20} />
          <h2>Account Security</h2>
        </div>
        <div className='security-info'>
          <div className='verification-status'>
            <p>
              Account Status:{" "}
              {userData.verified ? (
                <span className='status verified'>Verified</span>
              ) : (
                <span className='status unverified'>Unverified</span>
              )}
            </p>
          </div>
          {!userData.verified && (
            <Button color='primary' className='btn-block'>
              Verify Account
            </Button>
          )}
        </div>
      </div>

      <div className='settings-sections-grid'>
        {/* Notification Preferences Section */}
        <div className='settings-section'>
          <div className='section-header'>
            <Bell size={20} />
            <h2>Notification Preferences</h2>
          </div>
          <div className='notification-preferences'>
            {Object.keys(notificationPrefs).map((pref) => (
              <div key={pref} className='preference-item'>
                <span className='preference-label'>
                  {pref.charAt(0).toUpperCase() + pref.slice(1)}
                </span>
                <label className='toggle-switch'>
                  <input
                    type='checkbox'
                    name={pref}
                    checked={notificationPrefs[pref]}
                    onChange={handlePrefChange}
                  />
                  <span
                    className={`preference-value ${
                      notificationPrefs[pref] ? "enabled" : "disabled"
                    }`}>
                    {notificationPrefs[pref] ? "On" : "Off"}
                  </span>
                </label>
              </div>
            ))}
          </div>
          <Button
            color='primary'
            onClick={saveNotificationPreferences}
            className='btn-block'>
            Save Notifications
          </Button>
        </div>

        {/* Tags Section */}
        <div className='settings-section'>
          <div className='section-header'>
            <Tags size={20} />
            <h2>Preferred Tags</h2>
          </div>
          <div className='tag-preferences'>
            {availableTags.map((tag) => (
              <label key={tag._id} className='tag-item'>
                <Input
                  type='checkbox'
                  name={tag._id}
                  checked={preferredTags.includes(tag._id)}
                  onChange={() => handleTagSelection(tag._id)}
                />
                <span>{tag.name}</span>
              </label>
            ))}
          </div>
          <Button
            color='primary'
            onClick={saveTagPreferences}
            className='btn-block'>
            Save Tags
          </Button>
        </div>
      </div>
      {message && <p className='message'>{message}</p>}
    </div>
  );
};

export default Settings;
