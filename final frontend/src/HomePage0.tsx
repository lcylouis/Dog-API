import React from "react";
import { Link } from "react-router-dom";
import "./HomePage0.css";
const HomePage0: React.FC = () => {
  return (
    <div className="homeContainer">
      <h1>Welcome to The Canine Shelter</h1>
      <p>
        The Canine Shelter is a charitable organization dedicated to rescuing
        and rehoming dogs in need. We work tirelessly to pair these furry
        friends with loving families who can provide them with a forever home.
      </p>
      <div className="homeContent">
        <div className="homeSection">
          <h2>Adopt a Dog</h2>
          <p>
            Browse our available dogs and schedule a visit to meet your new
            companion.
          </p>
          <Link to="/dogs" className="btn">
            View Dogs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage0;
