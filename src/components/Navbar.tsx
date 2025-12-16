import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaPlusCircle, FaSearch, FaClipboardCheck } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
  const user = useAuth(); // now safe for public pages
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (user) navigate("/profile");
    else navigate("/register");
  };

  return (
    <nav className="navbar-container">
      <div className="navbar">
        <Link to="/">
          <FaHome style={{ marginRight: "7.5px" }} />
          Home
        </Link>
        <Link to="/report">
          <FaPlusCircle style={{ marginRight: "7.5px" }} />
          Report Item
        </Link>
        <Link to="/search">
          <FaSearch style={{ marginRight: "7.5px" }} />
          Search Items
        </Link>
        <Link to="/claims">
          <FaClipboardCheck style={{ marginRight: "7.5px" }} />
          Claim Status
        </Link>

        <div>
          <button className="register" onClick={handleButtonClick}>
            {user ? "Profile" : "Register"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
