import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Alert, Spinner } from 'reactstrap';
import '../CSS/AdminPanel.css';
import { useAuth } from '../context/AuthContext';
import api from '../services/authService';
import { Navigate } from 'react-router-dom';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching data for tab:', activeTab);

        switch (activeTab) {
          case 'dashboard':
            console.log('Making request to admin/stats');
            const statsResponse = await api.get('admin/stats');
            console.log('Stats response:', statsResponse.data);
            setStats(statsResponse.data);
            break;
          case 'users':
            console.log('Making request to admin/users');
            const usersResponse = await api.get('admin/users');
            console.log('Users response:', usersResponse.data);
            setUsers(usersResponse.data);
            break;
          case 'recipes':
            console.log('Making request to admin/recipes');
            const recipesResponse = await api.get('admin/recipes');
            console.log('Recipes response:', recipesResponse.data);
            setRecipes(recipesResponse.data);
            break;
          case 'posts':
            console.log('Making request to admin/forum-posts');
            const postsResponse = await api.get('admin/forum-posts');
            console.log('Posts response:', postsResponse.data);
            setPosts(postsResponse.data);
            break;
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        console.error('Error details:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          config: err.config
        });
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`admin/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await api.put(`admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(user => 
        user._id === userId ? response.data : user
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;

    try {
      await api.delete(`admin/recipes/${recipeId}`);
      setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete recipe');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`admin/forum-posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post');
    }
  };

  const renderDashboard = () => (
    <Row className="admin-stats">
      <Col md={4}>
        <Card className="stat-card">
          <h4>Users</h4>
          <h2>{stats?.counts.users || 0}</h2>
        </Card>
      </Col>
      <Col md={4}>
        <Card className="stat-card">
          <h4>Recipes</h4>
          <h2>{stats?.counts.recipes || 0}</h2>
        </Card>
      </Col>
      <Col md={4}>
        <Card className="stat-card">
          <h4>Forum Posts</h4>
          <h2>{stats?.counts.posts || 0}</h2>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="stat-card">
          <h4>Recent Users</h4>
          <Table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recent.users.map((user, index) => (
                <tr key={`${user._id}-${index}`}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="stat-card">
          <h4>Recent Recipes</h4>
          <Table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recent.recipes.map((recipe, index) => (
                <tr key={`${recipe._id}-${index}`}>
                  <td>{recipe.title}</td>
                  <td>{recipe.author.username}</td>
                  <td>{new Date(recipe.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </Col>
    </Row>
  );

  const renderUsers = () => (
    <Table className="admin-table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={`${user._id}-${index}`}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>
              <select 
                value={user.role} 
                onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                className="form-select admin-form-select"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </td>
            <td>
              <Button 
                color="danger" 
                size="sm" 
                onClick={() => handleDeleteUser(user._id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderRecipes = () => (
    <Table className="admin-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {recipes.map((recipe, index) => (
          <tr key={`${recipe._id}-${index}`}>
            <td>{recipe.title}</td>
            <td>{recipe.author.username}</td>
            <td>{new Date(recipe.createdAt).toLocaleDateString()}</td>
            <td>
              <Button 
                color="danger" 
                size="sm" 
                onClick={() => handleDeleteRecipe(recipe._id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderPosts = () => (
    <Table className="admin-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post, index) => (
          <tr key={`${post._id}-${index}`}>
            <td>{post.title}</td>
            <td>{post.author.username}</td>
            <td>{new Date(post.createdAt).toLocaleDateString()}</td>
            <td>
              <Button 
                color="danger" 
                size="sm" 
                onClick={() => handleDeletePost(post._id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <Container className="admin-panel">
      <h1>Admin Panel</h1>
      
      {error && (
        <Alert color="danger" className="error-alert">
          {error}
          <Button
            color="link"
            className="ms-2"
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchData();
            }}
          >
            Retry
          </Button>
        </Alert>
      )}

      <div className="admin-tabs">
        <Button
          color={activeTab === 'dashboard' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('dashboard')}
          className="me-2"
        >
          Dashboard
        </Button>
        <Button
          color={activeTab === 'users' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('users')}
          className="me-2"
        >
          Users
        </Button>
        <Button
          color={activeTab === 'recipes' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('recipes')}
          className="me-2"
        >
          Recipes
        </Button>
        <Button
          color={activeTab === 'posts' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('posts')}
        >
          Forum Posts
        </Button>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <Spinner color="primary" />
        </div>
      ) : (
        <div>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'recipes' && renderRecipes()}
          {activeTab === 'posts' && renderPosts()}
        </div>
      )}
    </Container>
  );
};

export default AdminPanel;
