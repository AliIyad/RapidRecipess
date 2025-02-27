import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../CSS/SearchPage.css"; // Import the new CSS
import { useParams } from "react-router-dom";

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchTerm = queryParams.get("query") || "";
  const initialSearchType = queryParams.get("type") || "ingredient";

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchType, setSearchType] = useState(initialSearchType);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    }
  }, [searchTerm, searchType]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:6969/recipe/${searchType}/${searchTerm}`
      );
      console.log(response.data);
      setRecipes(response.data);
    } catch (error) {
      console.error("Error searching recipes:", error);
      setError("Failed to search recipes. Please try again later.");
    }
  };

  const handleNavigateSearch = () => {
    navigate(`/search?query=${searchTerm}&type=${searchType}`);
  };

  const handleCardClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`); // Navigate to the specific recipe page
  };

  return (
    <div className='search-page-container'>
      <h2>Search Recipes</h2>
      <div className='search-bar'>
        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
          <DropdownToggle caret>
            {searchType.charAt(0).toUpperCase() + searchType.slice(1)}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => setSearchType("name")}>
              Name
            </DropdownItem>
            <DropdownItem onClick={() => setSearchType("ingredient")}>
              Ingredient
            </DropdownItem>
            <DropdownItem onClick={() => setSearchType("tag")}>
              Tag
            </DropdownItem>
            <DropdownItem onClick={() => setSearchType("difficulty")}>
              Difficulty
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Input
          type='text'
          placeholder={`Search by ${searchType}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button color='primary' onClick={handleNavigateSearch}>
          Search
        </Button>
      </div>
      <div className='search-results'>
        {error && <p className='error-message'>{error}</p>}
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div
              key={recipe._id}
              className='recipe-card'
              onClick={() => handleCardClick(recipe._id)}>
              <img
                src={recipe.imageUrl || "https://via.placeholder.com/200"}
                alt={recipe.title}
                className='recipe-card-image'
              />
              <div className='recipe-card-content'>
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p> {/* Optional description */}
              </div>
            </div>
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
