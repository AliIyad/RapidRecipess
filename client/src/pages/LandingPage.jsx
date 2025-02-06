import React from "react";
import "../CSS/LandingPage.css";

import Features from "../components/Features";
import SocialProof from "../components/SocialProof";
import Footer from "../components/Footer";

import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const Navigate = useNavigate();

  return (
    <div className='landing-page'>
      <section className='hero-section'>
        <div className='hero-content'>
          <h1>Rapid Recipes</h1>
          <p className='catchphrase'>
            Cook, Share, Connect.
            <br />A New Way to Experience Food Together.
          </p>
          <button
            className='cta-btn'
            type='button'
            onClick={() => {
              Navigate("/home");
            }}>
            Get Started
          </button>
        </div>
      </section>

      <SocialProof />
      <Features />
      <Footer />
    </div>
  );
};

export default LandingPage;
