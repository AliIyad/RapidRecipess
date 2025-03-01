import React, { useState } from 'react';
import { Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import { useAuth } from '../context/AuthContext';
import api from '../services/authService';

const ForumPost = ({ post, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?._id));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);

  const handleAddComment = async () => {
    if (!user) {
      setError('Please log in to comment');
      return;
    }

    if (!comment.trim()) return;

    try {
      const response = await api.post(`api/forum/${post._id}/comments`, {
        content: comment
      });

      setComments(prevComments => [...prevComments, response.data]);
      setComment('');
      setError('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment');
    }
  };

  const handleLike = async () => {
    if (!user) {
      setError('Please log in to like posts');
      return;
    }

    try {
      const response = await api.post(`api/forum/${post._id}/like`);
      const updatedPost = response.data;

      if (!updatedPost || !updatedPost.likes) {
        throw new Error('Invalid response format from server');
      }

      setIsLiked(updatedPost.likes.includes(user._id));
      setLikesCount(updatedPost.likes.length);
      setError('');
    } catch (error) {
      console.error('Error liking post:', error);
      setError(error.message || 'Failed to like post');
    }
  };

  // Fetch comments when showing comments section
  const toggleComments = async () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      try {
      const response = await api.get(`api/forum/${post._id}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Failed to load comments');
      }
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
            <Button 
              color="info" 
              size="sm"
              onClick={toggleComments}
            >
              Comments ({comments.length})
            </Button>
          </div>

          {user?._id === post.author._id && (
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

        {showComments && (
          <div className="mt-3">
            <div className="mb-3">
              <textarea
                className="form-control mb-2"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button 
                color="primary" 
                size="sm" 
                onClick={handleAddComment}
                disabled={!comment.trim()}
              >
                Add Comment
              </Button>
            </div>
            {comments.map((comment) => (
              <Card key={comment._id} className="mb-2">
                <CardBody>
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">
                      {comment.author?.username || 'Anonymous'} - {formatDate(comment.createdAt)}
                    </small>
                  </div>
                  <CardText className="mt-2">{comment.content}</CardText>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ForumPost;
