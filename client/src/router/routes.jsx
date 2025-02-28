import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Home from "../pages/HomePage";
import About from "../pages/AboutPage";
import Contact from "../pages/ContactPage";
import Services from "../pages/Services";
import PageNotFound from "../pages/PageNotFound";
import LandingPage from "../pages/LandingPage";
import RecipePage from "../pages/RecipePage";
import Profile from "../pages/ProfilePage";
import Settings from "../pages/SettingsPage";
import Community from "../pages/CommunityPage";
import RecipeSearch from "../pages/SearchPage";
import AdminPanel from "../pages/AdminPanel";

import Layout from "../components/Layout";
import withAuth from "../services/withAuth";

// Higher-order component for admin route protection
const withAdminAuth = (Component) => {
  const AdminProtected = withAuth(Component);
  return (props) => {
    const { user } = useAuth();
    if (user?.role !== "admin") {
      return <Navigate to='/' replace />;
    }
    return <AdminProtected {...props} />;
  };
};

const ProtectedAdminPanel = withAdminAuth(AdminPanel);

const ProtectedHome = withAuth(Home);
const ProtectedServices = withAuth(Services);
const ProtectedContact = withAuth(Contact);
const ProtectedRecipePage = withAuth(RecipePage);
const ProtectedProfile = withAuth(Profile);
const ProtectedSettings = withAuth(Settings);
const ProtectedCommunity = withAuth(Community);

const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/home' element={<ProtectedHome />} />
          <Route path='/about' element={<About />} />
          <Route path='/Community' element={<ProtectedCommunity />} />
          <Route path='/services' element={<ProtectedServices />} />
          <Route path='/contact' element={<ProtectedContact />} />
          <Route path='/recipe/:id' element={<ProtectedRecipePage />} />
          <Route path='/profile' element={<ProtectedProfile />} />
          <Route path='/settings' element={<ProtectedSettings />} />
          <Route path='/search' element={<RecipeSearch />} />
          <Route path='/admin' element={<ProtectedAdminPanel />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default Router;
