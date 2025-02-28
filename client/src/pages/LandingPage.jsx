import React from "react";
import { Button, Container, Row, Col } from "reactstrap";
import "../CSS/LandingPage.css";
import Features from "../components/Features";
import SocialProof from "../components/SocialProof";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className='landing-page'>
      <section className='hero-section'>
        <Container className='text-center hero-content'>
          <h1 className='hero-title'>Rapid Recipes</h1>
          <p className='catchphrase'>
            Cook, Share, Connect.
            <br />A New Way to Experience Food Together.
          </p>
          <Button
            color='primary'
            className='cta-btn'
            onClick={() => navigate("/home")}>
            Get Started
          </Button>
        </Container>
      </section>
      <SocialProof />
      <Features />
    </div>
  );
};

export default LandingPage;
