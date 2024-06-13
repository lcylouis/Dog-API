import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import DogListPage from "./DogListPage";
import DogDetailsPage from ".//DogDetailsPage";
import FavoritesPage from "./FavoritesPage";
import HomePage0 from "./HomePage0";
import "./App.css";
import DogSearchPage from "./DogSearchPage";
import HomePage from "./App";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");

    setIsLoggedIn(!!token);

    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  return (
    <Router>
      <div className="appContainer">
        <nav className="navContainer">
          <ul className="navLeft">
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
          <ul className="navRight">
            <li>
              <Link to="">Home</Link>
            </li>
            <li>
              <Link to="/dogs">Dogs</Link>
            </li>
            {userRole === "public" && (
              <li>
                <Link to="/favorites">Favourites</Link>
              </li>
            )}
          </ul>
        </nav>

        <Routes>
          <Route
            path="/login"
            element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="" element={<HomePage0 />} />
          <Route
            path="/dogs"
            element={
              isLoggedIn ? (
                localStorage.getItem("role") === "staff" ? (
                  <DogListPage />
                ) : (
                  <DogDetailsPage />
                )
              ) : (
                <DogSearchPage />
              )
            }
          />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
