import React from "react";
import { Card, CardBody, CardTitle, CardText, Button } from "reactstrap";
import { Link } from "react-router-dom";
import "../CSS/RecipeDashboard.css";

const RecipeDashboard = ({ recipes }) => {
  return (
    <div className='dashboard mt-5'>
      <h2>Recipe Dashboard</h2>
      <div className='recipe-list'>
        {recipes.length > 0 ? (
          recipes.map((recipe, index) => (
            <div key={index} className='recipe-post'>
              <Link to={`/recipe/${index}`} className='recipe-link'>
                <Card className='recipe-card'>
                  <img
                    src={recipe.image || "https://via.placeholder.com/150"}
                    alt={recipe.name}
                    className='recipe-card-image'
                  />
                  <CardBody>
                    <CardTitle tag='h5'>{recipe.name}</CardTitle>
                    <CardText>
                      <strong>Ingredients:</strong> {recipe.ingredients}
                    </CardText>
                    <CardText>
                      <strong>Prep Time:</strong> {recipe.prepTime} minutes
                    </CardText>

                    <div className='interaction-meters'>
                      <Button
                        outline
                        color='primary'
                        className='interaction-button'>
                        {recipe.likes} Likes
                      </Button>
                      <Button
                        outline
                        color='secondary'
                        className='interaction-button'>
                        {recipe.comments} Comments
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </div>
          ))
        ) : (
          <p>No recipes submitted yet. Add some recipes!</p>
        )}
      </div>
    </div>
  );
};

export default RecipeDashboard;
