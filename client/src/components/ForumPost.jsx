import React, { useState } from 'react';
import { Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ForumPost = ({ post, onDelete, onUpdate }) => {
  const { user, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?.id));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

  const handleLike = async () => {
    if (!user) {
      setError('Please log in to like posts');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/forum/${post._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setIsLiked(!isLiked);
      setLikesCount(response.data.likes.length);
      setError('');
    } catch (error) {
      console.error('Error liking post:', error);
      setError('Failed to like post');
    }
  };

  const handleUpdate = async () => {
    try {
      await onUpdate(post._id, { content: editedContent });
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update post');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="forum-post mb-3">
      <CardBody>
        <div className="d-flex justify-content-between align-items-start">
          <CardTitle tag="h5">{post.title}</CardTitle>
          <small className="text-muted">
            Posted by {post.author.username} on {formatDate(post.createdAt)}
          </small>
        </div>
        
        {isEditing ? (
          <div className="mt-3">
            <textarea
              className="form-control mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <Button color="primary" size="sm" onClick={handleUpdate} className="me-2">
              Save
            </Button>
            <Button color="secondary" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <CardText className="mt-3">{post.content}</CardText>
        )}

        {error && <div className="text-danger mt-2">{error}</div>}

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <Button color="primary" size="sm" onClick={handleLike} className="me-2">
              {isLiked ? 'Unlike' : 'Like'} ({likesCount})
            </Button>
            <Button color="info" size="sm">
              Comments ({post.comments?.length || 0})
            </Button>
          </div>

          {user?.id === post.author._id && (
            <div>
              <Button
                color="warning"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="me-2"
              >
                Edit
              </Button>
              <Button
                color="danger"
                size="sm"
                onClick={() => onDelete(post._id)}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default ForumPost;
