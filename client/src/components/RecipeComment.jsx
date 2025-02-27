import React, { useEffect, useState } from "react";
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
import axios from "axios";

const RecipeComments = ({ recipeId }) => {
  const { user, token, loading: authLoading } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [activeReply, setActiveReply] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:6969/comments/recipe/${recipeId}`
        );
        setComments(response.data.comments);
      } catch (err) {
        setError("Failed to load comments.");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [recipeId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return setError("Comment cannot be empty.");
    if (!user) return setError("You must be logged in.");

    try {
      const response = await axios.post(
        `http://localhost:6969/comments`,
        { content: newComment, recipeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prevComments) => [response.data, ...prevComments]);
      setNewComment("");
    } catch (err) {
      setError("Failed to post comment.");
    }
  };

  const handleReplyComment = async (commentId) => {
    if (!replyContent.trim()) return setError("Reply cannot be empty.");
    if (!user) return setError("You must be logged in.");

    try {
      const response = await axios.post(
        `http://localhost:6969/comments/reply`,
        { content: replyContent, parentCommentId: commentId, recipeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: [response.data, ...comment.replies] }
            : comment
        )
      );
      setReplyContent("");
      setActiveReply(null);
    } catch (err) {
      setError("Failed to post reply.");
    }
  };

  const toggleReplyForm = (commentId) => {
    setActiveReply(activeReply === commentId ? null : commentId);
    setReplyContent("");
  };

  if (authLoading) return <Spinner color='primary' />;
  if (!user) return <div>You must be logged in to view comments.</div>;

  return (
    <div className='recipe-comments mt-5'>
      <h3>Comments</h3>
      {error && <Alert color='danger'>{error}</Alert>}

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
          disabled={loading || !newComment.trim()}>
          {loading ? <Spinner size='sm' color='light' /> : "Post Comment"}
        </Button>
      </div>

      {loading ? (
        <Spinner color='primary' />
      ) : comments.length === 0 ? (
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

              {user && (
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
                    {loading ? (
                      <Spinner size='sm' color='light' />
                    ) : (
                      "Post Reply"
                    )}
                  </Button>
                </div>
              )}

              {comment.replies && (
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
                        {new Date(reply.createdAt).toLocaleString()}
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
