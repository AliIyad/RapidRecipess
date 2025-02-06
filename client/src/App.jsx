import "./App.css";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/HomePage";
import Profile from "./pages/ProfilePage";
import Settings from "./pages/SettingsPage";
import RecipePage from "./pages/RecipePage";
import About from "./pages/AboutPage";
import Contact from "./pages/ContactPage";
import Services from "./pages/Services";
import PageNotFound from "./pages/PageNotFound";

import Layout from "./components/Layout";
import Sidebar from "./components/SideBar";

function App() {
  return (
    <>
      <LandingPage />
      <PageNotFound />
      <Layout>
        <Sidebar />
        <Home />
        <About />
        <Services />
        <Contact />
        <RecipePage />
        <Profile />
        <Settings />
      </Layout>
    </>
  );
}

export default App;
