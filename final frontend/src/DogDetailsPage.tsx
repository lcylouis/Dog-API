// src/pages/DogDetailhPage.tsx
import React, { useState, useEffect } from "react";
import {
  getDogs,
  Dog,
  getUsers,
  createDoglist,
  DoglistRequest,
  getDoglists,
} from "./api";
import './DogDetailPage.css'; 
const DogDetailPage: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [userDoglists, setUserDoglists] = useState<DoglistRequest[]>([]);

  useEffect(() => {
    const fetchDogs = async () => {
      let dogsData = await getDogs();

      const token = localStorage.getItem("token");
      if (token) {
        try {
          const username = await localStorage.getItem("name");
          if (username) {
            const users = await getUsers();
            const user = users.find((u) => u.username === username);
            if (user) {
              const userDoglists = await getDoglists();
              setUserDoglists(userDoglists);

              const availableDogs = dogsData.filter(
                (dog) =>
                  !userDoglists.some(
                    (doglist) =>
                      doglist.dogId === dog.id && doglist.userId === user.id,
                  ),
              );
              setDogs(availableDogs);

              let filteredDogs = availableDogs;
              if (filters.name) {
                filteredDogs = filteredDogs.filter((dog) =>
                  dog.name.toLowerCase().includes(filters.name.toLowerCase()),
                );
              }
              if (filters.age) {
                filteredDogs = filteredDogs.filter(
                  (dog) => dog.age === parseInt(filters.age),
                );
              }
              if (filters.gender) {
                filteredDogs = filteredDogs.filter(
                  (dog) => dog.gender === filters.gender,
                );
              }
              setDogs(filteredDogs);
            } else {
              console.error("User not found.");
            }
          } else {
            console.error("Username not found in localStorage.");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchDogs();
  }, [filters]);

  const handleSearch = () => {
    setFilters({ ...filters, name: searchTerm });
  };

  const handleAddDog = async (dog: Dog) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const username = await localStorage.getItem("name");
        if (username) {
          const users = await getUsers();
          const user = users.find((u) => u.username === username);
          if (user) {
            const newDoglistData: DoglistRequest = {
              userId: user.id,
              dogId: dog.id,
            };

            const doglists = await getDoglists();
            const existingDoglist = doglists.find(
              (doglist) =>
                doglist.userId === newDoglistData.userId &&
                doglist.dogId === newDoglistData.dogId,
            );

            if (existingDoglist) {
              alert(`${dog.name} is already in your favourite list.`);
            } else {
              await createDoglist(newDoglistData);

              alert(`Added ${dog.name} to your favourite list!`);
            }
            window.location.reload();
          } else {
            console.error("User not found.");
          }
        } else {
          console.error("Username not found in localStorage.");
        }
      } else {
        console.error("Token not found in localStorage.");
      }
    } catch (error) {
      console.error("Error creating doglist:", error);
    }
  };

  const handleAddButtonClick = (dog: Dog) => {
    handleAddDog(dog);
  };
  return (
    <div className="dog-list-container">
      <h1>Dog List</h1>

      <div className="filter-container">
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

      <ul className="dog-list">
        {dogs.map((dog) => (
          <li key={dog.id}>
            <div>
              <h3>{dog.name}</h3>
              <p>Description: {dog.description}</p>
              <p>Age(yrs): {dog.age}</p>
              <p>Gender: {dog.gender}</p>
              {dog.imageUrl && (
                <img src={dog.imageUrl} alt={dog.name} width="100" />
              )}
              <button className="add-favorite-button" onClick={(event) => handleAddButtonClick(dog)}>
                Add Favourites
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DogDetailPage;
