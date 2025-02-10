import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/HomePage";
import About from "../pages/AboutPage";
import Contact from "../pages/ContactPage";
import Services from "../pages/Services";
import PageNotFound from "../pages/PageNotFound";
import LandingPage from "../pages/LandingPage";
import RecipePage from "../pages/RecipePage";
import Profile from "../pages/ProfilePage";
import Settings from "../pages/SettingsPage";

import Layout from "../components/Layout";

const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/home' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/services' element={<Services />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/recipe/:index' element={<RecipePage />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default Router;
