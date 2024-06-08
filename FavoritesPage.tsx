// src/pages/FavoritesPage.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Dog } from "./types";

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Dog[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get("/api/favorites");
        setFavorites(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div>
      <h1>Favorites</h1>
      <ul>
        {favorites.map((dog) => (
          <li key={dog.id}>
            <Link to={`/dogs/${dog.id}`}>{dog.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesPage;
