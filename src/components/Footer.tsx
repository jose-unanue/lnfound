import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; 2025 LNFound. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/report">Report Item</Link>
          <Link to="/search">Search Items</Link>
          <Link to="/claims">Claim Status</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
