import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Input,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";

function Navi(args) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(
        `/search?query=${encodeURIComponent(searchTerm)}&type=ingredient`
      );
    }
  };

  const handleLogout = () => {
    logout();
  };

  const divStyle = {
    color: isHovered ? "#DB2626" : "#FFFFFF",
    borderRadius: "15px",
  };

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar {...args} color='dark' dark expand='md' fixed='top'>
        <NavbarBrand tag={Link} to='/home'>
          <img
            src='./logo.png'
            alt='Rapid Recipes Logo'
            style={{
              width: 55,
              height: 55,
              margin: 5,
              padding: 5,
              marginLeft: 10,
              marginRight: 15,
            }}
          />
          Rapid Recipes
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className='me-auto' navbar style={{ marginRight: "auto" }}>
            <NavItem>
              <Link className='nav-link' to='/community'>
                Community
              </Link>
            </NavItem>
            <NavItem>
              <Link className='nav-link' to='/about'>
                About
              </Link>
            </NavItem>
            <NavItem>
              <Link className='nav-link' to='/contact'>
                Contact
              </Link>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle
                nav
                caret
                style={divStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}>
                Options
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem divider />
                <DropdownItem tag={Link} to='/profile'>
                  Profile
                </DropdownItem>
                <DropdownItem tag={Link} to='/services'>
                  Services
                </DropdownItem>
                <DropdownItem tag={Link} to='/settings'>
                  Settings
                </DropdownItem>
                {user?.role === "admin" && (
                  <DropdownItem tag={Link} to='/admin'>
                    Admin Panel
                  </DropdownItem>
                )}
                <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                <DropdownItem divider />
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          <div className='navbar-search'>
            <Input
              type='text'
              placeholder='Search...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='search-input'
            />
            <Button
              color='primary'
              onClick={handleSearch}
              className='search-button'>
              Search
            </Button>
          </div>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Navi;
