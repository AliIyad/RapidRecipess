import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner, Alert, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { useAuth } from '../context/AuthContext';
import ForumPost from '../components/ForumPost';
import ForumPostForm from '../components/ForumPostForm';
import api from '../services/authService';
import '../CSS/CommunityPage.css';

const CommunityPage = () => {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`api/forum?page=${page}`);
      setPosts(response.data.posts);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.response?.data?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setShowPostForm(false);
  };

  const handlePostUpdate = async (postId, updateData) => {
    try {
      const response = await api.put(`api/forum/${postId}`, updateData);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId ? response.data : post
        )
      );
    } catch (err) {
      setError('Failed to update post');
    }
  };

  const handlePostDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`api/forum/${postId}`);
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      } catch (err) {
        setError('Failed to delete post');
      }
    }
  };

  const handlePageChange = (page) => {
    fetchPosts(page);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner color="primary" />
      </Container>
    );
  }

  return (
    <Container className="community-page py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1>Community Forum</h1>
              <p className="mb-0">Join the discussion with fellow cooking enthusiasts!</p>
            </div>
            {user ? (
              <div>
                <Button
                  color="primary"
                  size="lg"
                  className="create-post-btn"
                  onClick={() => setShowPostForm(!showPostForm)}
                >
                  {showPostForm ? 'Cancel' : '+ New Post'}
                </Button>
                <small className="text-muted d-block mt-2">
                  Logged in as: {user.email}
                </small>
              </div>
            ) : (
              <div>
                <small className="text-muted">
                  Please log in to create posts
                </small>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {error && (
        <Alert color="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <h4 className="mb-0">Recent Posts</h4>
            <small className="text-muted ms-3">
              {pagination.total} posts in total
            </small>
          </div>
        </Col>
      </Row>

      {showPostForm && (
        <Row className="mb-4">
          <Col>
            <ForumPostForm onPostCreated={handlePostCreated} />
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          {posts.length > 0 ? (
            posts.map(post => (
              <ForumPost
                key={post._id}
                post={post}
                onDelete={handlePostDelete}
                onUpdate={handlePostUpdate}
              />
            ))
          ) : (
            <div className="text-center py-5">
              <h4>No posts yet</h4>
              <p>Be the first to start a discussion!</p>
            </div>
          )}
        </Col>
      </Row>

      {pagination.totalPages > 1 && (
        <Row className="mt-4">
          <Col className="d-flex justify-content-center">
            <Pagination>
              <PaginationItem disabled={pagination.currentPage === 1}>
                <PaginationLink
                  previous
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                />
              </PaginationItem>
              
              {[...Array(pagination.totalPages)].map((_, i) => (
                <PaginationItem
                  key={i + 1}
                  active={i + 1 === pagination.currentPage}
                >
                  <PaginationLink onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem disabled={pagination.currentPage === pagination.totalPages}>
                <PaginationLink
                  next
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                />
              </PaginationItem>
            </Pagination>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CommunityPage;
