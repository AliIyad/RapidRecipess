import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, CardText, Button, Input } from "reactstrap";
import api from "../services/authService"; // Import the api instance
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RecipeComments = ({ recipeId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/comments/recipe/${recipeId}`);
        console.log("Fetched Comments:", response.data); // Debugging log
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError("Failed to fetch comments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
    fetchInteractionCounts("comment", recipeId);
  }, [recipeId]);

  // Add a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      const response = await api.post("/comments", {
        content: newComment,
        recipeId,
      }); // Use the api instance
      setComments((prevComments) => [response.data, ...prevComments]);
      setNewComment("");
      setError(null);
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again later.");
    }
  };

  // Like or dislike a comment
  const handleInteraction = async (contentType, contentId, reactionType) => {
    try {
      // Optimistically update the UI
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === contentId
            ? {
                ...comment,
                Interactions: [
                  ...comment.Interactions,
                  { reactionType, userId: { _id: user.id } }, // Use the actual user ID
                ],
              }
            : comment
        )
      );

      // Send the interaction to the backend
      await api.post("/interaction", {
        contentType,
        contentId,
        reactionType,
      });

      // Refetch interaction counts for updated data
      fetchInteractionCounts(contentType, contentId);
    } catch (error) {
      console.error("Error adding interaction:", error);
      setError("Failed to add interaction. Please try again later.");

      // Revert the optimistic update if the request fails
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === contentId
            ? {
                ...comment,
                Interactions: comment.Interactions.filter(
                  (i) => i.userId._id !== user.id
                ),
              }
            : comment
        )
      );
    }
  };

  // Fetch interaction counts (like/dislike) for a comment
  const fetchInteractionCounts = async (contentType, contentId) => {
    try {
      const response = await api.get(
        `/interaction/count/${contentType}/${contentId}`
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === contentId
            ? {
                ...comment,
                likeCount: response.data.likes,
                dislikeCount: response.data.dislikes,
              }
            : comment
        )
      );
    } catch (error) {
      console.error("Error fetching interaction counts:", error);
    }
  };

  return (
    <div className='recipe-comments mt-5'>
      <h3>Comments</h3>
      {error && <p className='text-danger'>{error}</p>}

      {/* Add a new comment */}
      <div className='add-comment mb-4'>
        <Input
          type='textarea'
          placeholder='Add a comment...'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button color='primary' onClick={handleAddComment} className='mt-2'>
          Post Comment
        </Button>
      </div>

      {/* Display comments */}
      {loading ? (
        <p className='text-muted'>Loading comments...</p>
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <Card key={comment._id} className='mb-3'>
            <CardBody>
              <CardTitle tag='h6'>
                {comment.userId?.username || "Anonymous"}
              </CardTitle>
              <CardText>{comment.content}</CardText>
              <div className='interaction-buttons'>
                <Button
                  outline
                  color='primary'
                  size='sm'
                  onClick={() =>
                    handleInteraction("comment", comment._id, "like")
                  }>
                  Like ({comment.likeCount || 0})
                </Button>
                <Button
                  outline
                  color='secondary'
                  size='sm'
                  className='ms-2'
                  onClick={() =>
                    handleInteraction("comment", comment._id, "dislike")
                  }>
                  Dislike ({comment.dislikeCount || 0})
                </Button>
              </div>
            </CardBody>
          </Card>
        ))
      ) : (
        <p>No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default RecipeComments;
