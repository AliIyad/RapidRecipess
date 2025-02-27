import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Alert, Spinner } from 'reactstrap';
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

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        switch (activeTab) {
          case 'dashboard':
            const statsResponse = await api.get('admin/stats');
            setStats(statsResponse.data);
            break;
          case 'users':
            const usersResponse = await api.get('admin/users');
            setUsers(usersResponse.data);
            break;
          case 'recipes':
            const recipesResponse = await api.get('admin/recipes');
            setRecipes(recipesResponse.data);
            break;
          case 'posts':
            const postsResponse = await api.get('admin/forum-posts');
            setPosts(postsResponse.data);
            break;
        }
      } catch (err) {
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
    <Row>
      <Col md={4}>
        <Card className="mb-4 p-3">
          <h4>Users</h4>
          <h2>{stats?.counts.users || 0}</h2>
        </Card>
      </Col>
      <Col md={4}>
        <Card className="mb-4 p-3">
          <h4>Recipes</h4>
          <h2>{stats?.counts.recipes || 0}</h2>
        </Card>
      </Col>
      <Col md={4}>
        <Card className="mb-4 p-3">
          <h4>Forum Posts</h4>
          <h2>{stats?.counts.posts || 0}</h2>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="mb-4 p-3">
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
              {stats?.recent.users.map(user => (
                <tr key={user._id}>
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
        <Card className="mb-4 p-3">
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
              {stats?.recent.recipes.map(recipe => (
                <tr key={recipe._id}>
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
    <Table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user._id}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>
              <select 
                value={user.role} 
                onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                className="form-select"
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
    <Table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {recipes.map(recipe => (
          <tr key={recipe._id}>
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
    <Table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {posts.map(post => (
          <tr key={post._id}>
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

  return (
    <Container className="py-4">
      <h1 className="mb-4">Admin Panel</h1>
      
      {error && (
        <Alert color="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="mb-4">
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
        <div className="text-center">
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
