import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Input,
  Spinner,
  Alert,
} from "reactstrap";
import { useAuth } from "../context/AuthContext";
import api from "../services/authService";

const RecipeComments = ({ recipeId }) => {
  const { user, token, loading: authLoading, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [activeReply, setActiveReply] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Use axios directly for fetching comments
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/comments/recipe/${recipeId}`);
        setComments(response.data.comments);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError("Failed to load comments.");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [recipeId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return setError("Comment cannot be empty.");
    if (!isAuthenticated) return setError("You must be logged in to comment.");

    try {
      const response = await api.post('comments', {
        content: newComment,
        recipeId
      });
      setComments((prevComments) => [response.data, ...prevComments]);
      setNewComment("");
      setError(null);
    } catch (err) {
      console.error('Error posting comment:', err);
      setError("Failed to post comment.");
    }
  };

  const handleReplyComment = async (commentId) => {
    if (!replyContent.trim()) return setError("Reply cannot be empty.");
    if (!isAuthenticated) return setError("You must be logged in to reply.");

    try {
      const response = await api.post('comments/reply', {
        content: replyContent,
        parentCommentId: commentId,
        recipeId
      });
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: [response.data, ...comment.replies] }
            : comment
        )
      );
      setReplyContent("");
      setActiveReply(null);
      setError(null);
    } catch (err) {
      console.error('Error posting reply:', err);
      setError("Failed to post reply.");
    }
  };

  const toggleReplyForm = (commentId) => {
    setActiveReply(activeReply === commentId ? null : commentId);
    setReplyContent("");
  };

  if (loading) return <Spinner color='primary' />;

  return (
    <div className='recipe-comments mt-5'>
      <h3>Comments</h3>
      {error && <Alert color='danger'>{error}</Alert>}

      {isAuthenticated ? (
        <div className='add-comment mb-4'>
          <Input
            type='textarea'
            placeholder='Add a comment...'
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            color='primary'
            onClick={handleAddComment}
            className='mt-2'
            disabled={!newComment.trim()}>
            Post Comment
          </Button>
        </div>
      ) : (
        <Alert color='info'>Please log in to post comments.</Alert>
      )}

      {comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        comments.map((comment) => (
          <Card key={comment._id} className='mb-3 shadow-sm rounded-lg'>
            <CardBody>
              <CardTitle tag='h6'>
                {comment.userId ? comment.userId.username : "Anonymous"}
                <span className='text-muted ml-2'>
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </CardTitle>
              <CardText>{comment.content}</CardText>

              {isAuthenticated && (
                <Button
                  color='link'
                  onClick={() => toggleReplyForm(comment._id)}
                  className='btn-reply'>
                  Reply
                </Button>
              )}

              {activeReply === comment._id && (
                <div className='reply-form mt-2'>
                  <Input
                    type='textarea'
                    placeholder='Write a reply...'
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <Button
                    color='primary'
                    onClick={() => handleReplyComment(comment._id)}
                    className='mt-2'
                    disabled={!replyContent.trim()}>
                    Post Reply
                  </Button>
                </div>
              )}

              {comment.replies && comment.replies.length > 0 && (
                <div className='replies-container ml-4 mt-3'>
                  {comment.replies.map((reply) => (
                    <Card key={reply._id} className='mb-2 shadow-sm rounded-lg'>
                      <CardBody>
                        <CardTitle tag='h6'>
                          <span className='text-muted ml-2'>
                            {reply.userId ? reply.userId.username : "Anonymous"}
                          </span>
                        </CardTitle>
                        <CardText>{reply.content}</CardText>
                        <small className='text-muted'>
                          {new Date(reply.createdAt).toLocaleString()}
                        </small>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        ))
      )}
    </div>
  );
};

export default RecipeComments;
