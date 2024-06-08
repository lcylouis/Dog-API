import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import DogListPage from "./DogListPage";
import DogDetailsPage from ".//DogDetailsPage";
import FavoritesPage from "./FavoritesPage";
import MessagePage from "./MessagePage";
import "./App.css";
import DogSearchPage from "./DogSearchPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
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
              <Link to="/dogs">Dogs</Link>
            </li>
            <li>
              <Link to="/favorites">Favorites</Link>
            </li>
            <li>
              <Link to="/messages">Messages</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route
            path="/login"
            element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dogs"
            element={isLoggedIn ? <DogListPage /> : <DogSearchPage />}
          />
          <Route path="/dogs/:id" element={<DogDetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/messages" element={<MessagePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
