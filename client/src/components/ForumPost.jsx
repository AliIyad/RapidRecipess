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

      if (!response.data?.success || !response.data?.comment) {
        throw new Error('Invalid response format from server');
      }

      setComments(prevComments => [...prevComments, response.data.comment]);
      setComment('');
      setError('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError(error.response?.data?.message || 'Failed to add comment. Please try again.');
    }
  };

  const handleLike = async () => {
    if (!user) {
      setError('Please log in to like posts');
      return;
    }

    try {
      // Optimistic update
      const newIsLiked = !isLiked;
      const newLikesCount = isLiked ? likesCount - 1 : likesCount + 1;
      
      setIsLiked(newIsLiked);
      setLikesCount(newLikesCount);

      const response = await api.post(`api/forum/${post._id}/like`);

      if (!response.data?.success || !response.data?.post) {
        throw new Error('Invalid response format from server');
      }

      // Update with actual server data
      setLikesCount(response.data.post.likesCount);
      setError('');
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(!isLiked);
      setLikesCount(likesCount);
      console.error('Error liking post:', error);
      setError(error.response?.data?.message || 'Failed to update like status. Please try again.');
    }
  };

  // Fetch comments when showing comments section
  const toggleComments = async () => {
    const newShowComments = !showComments;
    setShowComments(newShowComments);
    
    if (newShowComments) {
      try {
        const response = await api.get(`api/forum/${post._id}/comments`);
        
        if (!response.data?.success || !Array.isArray(response.data?.comments)) {
          throw new Error('Invalid response format from server');
        }
        
        setComments(response.data.comments);
        setError('');
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError(error.response?.data?.message || 'Failed to load comments. Please try again.');
        setShowComments(false); // Revert on error
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
