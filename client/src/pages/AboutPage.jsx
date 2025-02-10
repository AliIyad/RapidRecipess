import React from "react";
import "../CSS/AboutPage.css";

const AboutPage = () => {
  return (
    <div className='about-page'>
      <section className='about-header'>
        <h1>About Rapid Recipes</h1>
      </section>

      <section className='about-content'>
        <h2>Our Mission</h2>
        <p>
          At Rapid Recipes, we believe food is a universal language that brings
          people together. Our mission is to provide a platform where everyone
          can share their culinary creations, discover new dishes, and connect
          with like-minded food lovers across the world.
        </p>

        <h2>Our Story</h2>
        <p>
          Started by a group of passionate chefs and home cooks, Rapid Recipes
          was born out of the desire to make cooking easier and more enjoyable
          for everyone. We aim to build a community where you can not only find
          inspiration but also connect with others to share tips, tricks, and
          your best recipes!
        </p>

        <h2>Meet Our Team</h2>
        <div className='about-team'>
          <div className='team-member'>
            <img src='team1.jpg' alt='Team Member 1' />
            <h3>Ben Dover</h3>
            <p>Founder & Head Chef</p>
          </div>
          <div className='team-member'>
            <img src='team2.jpg' alt='Team Member 2' />
            <h3>Mike Hunt</h3>
            <p>Community Manager</p>
          </div>
          <div className='team-member'>
            <img src='team3.jpg' alt='Team Member 3' />
            <h3>Anita Patel</h3>
            <p>Marketing Specialist</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
