import React from "react";
import Layout from "../components/Layout";
import FeaturedRecipesCarousel from "../components/FeaturedRecipes";

import "../CSS/HomePage.css";

const Home = () => {
  const recipes = [
    {
      name: "Lasagna",
      description: "Warm, cheesy, and filling!",
      imageUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      name: "Spaghetti",
      description: "A classic Italian dish with a rich and meaty sauce.",
      imageUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      name: "Pizza",
      description: "Soft, Spicy and delicious!",
      imageUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  ];

  return (
    <>
      <div className='home' style={{ marginLeft: "230px" }}>
        <Layout>
          <div className='home-header' style={{ marginTop: "100px" }}>
            <h1>Welcome to Rapid Recipes!</h1>
          </div>
          <br />
          <div className='home-banner'>
            <h1>Featured Recipes</h1>
            <FeaturedRecipesCarousel recipes={recipes} />
          </div>
        </Layout>
      </div>
    </>
  );
};

export default Home;
