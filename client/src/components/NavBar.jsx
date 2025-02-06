import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import "bootstrap/dist/css/bootstrap.min.css";

function Navi(args) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const divStyle = {
    color: isHovered ? "#DB2626" : "#FFFFFF",
    borderRadius: "15px",
  };

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar {...args} color='dark' dark expand='md' fixed='top'>
        <NavbarBrand href='/home'>
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
              <NavLink href='/about'>About</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/contact'>Contact</NavLink>
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
                <DropdownItem href='/profile'>Profile</DropdownItem>
                <DropdownItem href='/services'>Services</DropdownItem>
                <DropdownItem href='/settings'>Settings</DropdownItem>
                <DropdownItem divider />
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Navi;
