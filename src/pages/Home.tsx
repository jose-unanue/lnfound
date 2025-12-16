import React from "react";
import "../styles/Home.css";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to LNFound</h1>
          <p>
            Your school’s smart Lost & Found portal. Quickly report lost items,
            track found belongings, and keep our campus organized.
          </p>
          <button className="cta-button">Report an Item</button>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>Why LNFound?</h2>
        <div className="about-content">
          <p>
            LNFound combines modern technology with school workflows to make
            reporting and reclaiming lost items faster and more reliable.
          </p>
          <p>
            Built for students, by students, this platform demonstrates innovation,
            responsibility, and practical problem-solving — perfect for FBLA competitions.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Features for Students</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Report Lost Items</h3>
            <p>
              Submit details about lost belongings and upload images for easier recovery.
            </p>
          </div>
          <div className="feature-card">
            <h3>Track Found Items</h3>
            <p>
              See updates on items found around school and claim them quickly.
            </p>
          </div>
          <div className="feature-card">
            <h3>Student Privacy</h3>
            <p>
              Only authorized users can report and claim items — keeping everyone safe.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
