import "./App.css";
import Home from "./pages/HomePage";
import Profile from "./pages/ProfilePage";
import Settings from "./pages/SettingsPage";
import RecipePage from "./pages/RecipePage";
import About from "./pages/AboutPage";
import Contact from "./pages/ContactPage";
import Services from "./pages/Services";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <>
      <PageNotFound />
      <Home />
      <About />
      <Services />
      <Contact />
      <RecipePage />
      <Profile />
      <Settings />
    </>
  );
}

export default App;
