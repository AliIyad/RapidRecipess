import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, CardTitle, CardText, Button, Input } from "reactstrap";

const RecipeComments = ({ recipeId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch comments for the recipe
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:6969/comments/recipe/${recipeId}`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to fetch comments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Add a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:6969/comments", {
        content: newComment,
        recipeId,
      });
      setComments((prevComments) => [response.data, ...prevComments]);
      setNewComment("");
      setError(null);
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again later.");
    }
  };

  // Like or dislike a comment
  const handleInteraction = async (commentId, reactionType) => {
    try {
      await axios.post(
        `http://localhost:6969/comments/${commentId}/interaction`,
        { reactionType }
      );
      // Refresh comments after interaction
      fetchComments();
    } catch (error) {
      console.error("Error adding interaction:", error);
      setError("Failed to add interaction. Please try again later.");
    }
  };

  // Fetch comments when the component mounts
  useEffect(() => {
    fetchComments();
  }, [recipeId]);

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
              <CardTitle tag='h6'>{comment.user.username}</CardTitle>
              <CardText>{comment.content}</CardText>
              <div className='interaction-buttons'>
                <Button
                  outline
                  color='primary'
                  size='sm'
                  onClick={() => handleInteraction(comment._id, "like")}>
                  Like (
                  {
                    comment.Interactions.filter(
                      (i) => i.reactionType === "like"
                    ).length
                  }
                  )
                </Button>
                <Button
                  outline
                  color='secondary'
                  size='sm'
                  className='ms-2'
                  onClick={() => handleInteraction(comment._id, "dislike")}>
                  Dislike (
                  {
                    comment.Interactions.filter(
                      (i) => i.reactionType === "dislike"
                    ).length
                  }
                  )
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
