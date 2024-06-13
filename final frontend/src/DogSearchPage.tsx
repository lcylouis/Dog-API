// src/pages/DogSearchPage.tsx
import React, { useState, useEffect } from "react";
import { getDogs, Dog, DogRequest } from "./api";
import './DogSearchPage.css'; 
const DogSearchPage: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchDogs = async () => {
      let dogsData = await getDogs();

      if (filters.name) {
        dogsData = dogsData.filter((dog) =>
          dog.name.toLowerCase().includes(filters.name.toLowerCase()),
        );
      }
      if (filters.age) {
        dogsData = dogsData.filter((dog) => dog.age === parseInt(filters.age));
      }
      if (filters.gender) {
        dogsData = dogsData.filter((dog) => dog.gender === filters.gender);
      }

      setDogs(dogsData);
    };
    fetchDogs();
  }, [filters, searchTerm]);

  const handleSearch = () => {
    setFilters({ ...filters, name: searchTerm });
  };

  return (
    <div>
      <h1>Dog List</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by age"
          value={filters.age}
          onChange={(e) => setFilters({ ...filters, age: e.target.value })}
        />
        <select
          value={filters.gender}
          onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="dog-list">
        {dogs.map((dog) => (
          <div key={dog.id} className="dog-card">
            <h3>{dog.name}</h3>
            <p>Description: {dog.description}</p>
            <p>Age(yrs): {dog.age}</p>
            <p>Gender: {dog.gender}</p>
            {dog.imageUrl && (
              <img src={dog.imageUrl} alt={dog.name} className="dog-image" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DogSearchPage;
