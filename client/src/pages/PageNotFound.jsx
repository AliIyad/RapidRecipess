import React from "react";
import { Container, Button } from "reactstrap";
import { Link } from "react-router-dom";
import "../CSS/NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <Container className='not-found-container'>
      <div className='not-found-header'>
        <h1>Oops!</h1>
        <h2>Page Not Found</h2>
      </div>
      <p className='not-found-text'>
        We're sorry, but the page you're looking for doesn't exist. You can
        return to the homepage or explore other parts of the site.
      </p>
      <Link to='/'>
        <Button color='primary' className='not-found-button'>
          Go to Homepage
        </Button>
      </Link>
    </Container>
  );
};

export default NotFoundPage;
