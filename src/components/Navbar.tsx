import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaPlusCircle,
  FaSearch,
  FaClipboardCheck,
  FaBars,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleButtonClick = () => {
    if (user) navigate("/profile");
    else navigate("/register");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar-container">
      <div className="navbar">
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={closeMenu}>
            <FaHome />
            Home
          </Link>

          <Link to="/report" onClick={closeMenu}>
            <FaPlusCircle />
            Report Item
          </Link>

          <Link to="/search" onClick={closeMenu}>
            <FaSearch />
            Search Items
          </Link>

          <Link to="/claims" onClick={closeMenu}>
            <FaClipboardCheck />
            Claim Status
          </Link>
        </div>

        <button className="register" onClick={handleButtonClick}>
          {user ? "Profile" : "Register"}
        </button>

        <button
          className="hamburger"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <FaBars />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
