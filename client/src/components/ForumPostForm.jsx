import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { useAuth } from '../context/AuthContext';
import { getAuth, getIdToken } from 'firebase/auth';
import axios from 'axios';

const ForumPostForm = ({ onPostCreated }) => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !token) {
      setError('You must be logged in to create a post');
      return;
    }

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      console.log('Creating post with data:', {
        title: formData.title,
        content: formData.content,
        tags: tagsArray
      });

      // Get fresh token
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Not authenticated');
      }
      
      const freshToken = await getIdToken(currentUser, true);
      
      // Remove any trailing slash from the API URL
      const apiUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '');
      console.log('API URL:', apiUrl);

      const response = await axios.post(
        `${apiUrl}/api/forum`,
        {
          title: formData.title.trim(),
          content: formData.content.trim(),
          tags: tagsArray
        },
        {
          headers: {
            'Authorization': `Bearer ${freshToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Post created successfully:', response.data);

      // Clear form
      setFormData({
        title: '',
        content: '',
        tags: ''
      });

      // Notify parent component
      if (onPostCreated) {
        onPostCreated(response.data);
      }
    } catch (err) {
      console.error('Error creating post:', err);
      if (err.response?.status === 401) {
        setError('Please log in again to create a post');
      } else {
        setError(err.response?.data?.message || 'Failed to create post. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forum-post-form mb-4">
      <h3>Create New Post</h3>
      <Form onSubmit={handleSubmit}>
        {error && <Alert color="danger">{error}</Alert>}
        
        <FormGroup>
          <Label for="title">Title</Label>
          <Input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter post title"
          />
        </FormGroup>

        <FormGroup>
          <Label for="content">Content</Label>
          <Input
            type="textarea"
            name="content"
            id="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Write your post content here..."
          />
        </FormGroup>

        <FormGroup>
          <Label for="tags">Tags (comma-separated)</Label>
          <Input
            type="text"
            name="tags"
            id="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="recipe, cooking, tips"
          />
        </FormGroup>

        <Button
          color="primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Post'}
        </Button>
      </Form>
    </div>
  );
};

export default ForumPostForm;
