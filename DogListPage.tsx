// src/pages/DogListPage.tsx
import React, { useState, useEffect } from "react";
import {
  getDogs,
  createDog,
  updateDog,
  deleteDog,
  Dog,
  DogRequest,
} from "./api";

const DogListPage: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [newDog, setNewDog] = useState<DogRequest>({
    name: "",
    description: "",
    age: 0,
    gender: "",
    imageUrl: "",
  });
  const [newDogImage, setNewDogImage] = useState<File | null>(null);
  const [editingDog, setEditingDog] = useState<Dog | null>(null);
  const [updatedDog, setUpdatedDog] = useState<DogRequest>({
    name: "",
    description: "",
    age: 0,
    gender: "",
    imageUrl: "",
  });
  const [updatedDogImage, setUpdatedDogImage] = useState<File | null>(null);

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

  const handleCreateDog = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newDog.name);
      formData.append("description", newDog.description);
      formData.append("age", newDog.age.toString());
      formData.append("gender", newDog.gender);
      if (newDogImage) {
        formData.append("image", newDogImage);
      }

      const dogRequest: DogRequest = {
        name: newDog.name,
        description: newDog.description,
        age: newDog.age,
        gender: newDog.gender,
        imageUrl: newDogImage ? URL.createObjectURL(newDogImage) : "",
      };

      const createdDog = await createDog(dogRequest);
      setDogs([...dogs, createdDog]);
      setNewDog({
        name: "",
        description: "",
        age: 0,
        gender: "",
        imageUrl: "",
      });
      setNewDogImage(null);
    } catch (error) {
      console.error("Error creating dog:", error);
    }
  };

  const handleUpdateDog = async () => {
    try {
      const updatedDogData: DogRequest = {
        name: updatedDog.name,
        description: updatedDog.description,
        age: updatedDog.age,
        gender: updatedDog.gender,
        imageUrl: updatedDogImage
          ? URL.createObjectURL(updatedDogImage)
          : editingDog?.imageUrl ?? "",
      };

      const updatedDogObject = await updateDog(editingDog!.id, updatedDogData);
      setDogs(
        dogs.map((dog) => (dog.id === editingDog!.id ? updatedDogObject : dog)),
      );
      setEditingDog(null);
      setUpdatedDog({
        name: "",
        description: "",
        age: 0,
        gender: "",
        imageUrl: "",
      });
      setUpdatedDogImage(null);
    } catch (error) {
      console.error("Error updating dog:", error);
    }
  };

  const handleEditDog = (dog: Dog) => {
    setEditingDog(dog);
    setUpdatedDog({
      name: dog.name,
      description: dog.description,
      age: dog.age,
      gender: dog.gender,
      imageUrl: dog.imageUrl,
    });
  };

  const handleDeleteDog = async (id: string) => {
    try {
      await deleteDog(id);
      setDogs(dogs.filter((dog) => dog.id !== id));
    } catch (error) {
      console.error("Error deleting dog:", error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setNewDogImage(event.target.files[0]);
      setUpdatedDogImage(event.target.files[0]);
    }
  };

  return (
    <div>
      <h1>Dog List</h1>

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
      <br></br>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {dogs.map((dog) => (
          <li key={dog.id}>
            <div>
              <h3>{dog.name}</h3>
              <p>Description: {dog.description}</p>
              <p>Age: {dog.age}</p>
              <p>Gender: {dog.gender}</p>
              {dog.imageUrl && (
                <img src={dog.imageUrl} alt={dog.name} width="100" />
              )}
            </div>
            <div>
              <button onClick={() => handleEditDog(dog)}>Update</button>
              <button onClick={() => handleDeleteDog(dog.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <h2>Add New Dog</h2>
      <input
        type="text"
        placeholder="Name"
        value={newDog.name}
        onChange={(e) => setNewDog({ ...newDog, name: e.target.value })}
      />
      <br></br>
      <textarea
        placeholder="Description"
        value={newDog.description}
        onChange={(e) => setNewDog({ ...newDog, description: e.target.value })}
      />
      <br></br>
      <input
        type="number"
        placeholder="Age"
        value={newDog.age}
        onChange={(e) =>
          setNewDog({ ...newDog, age: parseInt(e.target.value) })
        }
      />
      <br></br>
      <select
        value={newDog.gender}
        onChange={(e) => setNewDog({ ...newDog, gender: e.target.value })}
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <br></br>
      <input type="file" onChange={handleImageUpload} />
      <button onClick={handleCreateDog}>Create Dog</button>
      {editingDog && (
        <div>
          <h2>Update Dog</h2>
          <input
            type="text"
            placeholder="Name"
            value={updatedDog.name}
            onChange={(e) =>
              setUpdatedDog({ ...updatedDog, name: e.target.value })
            }
          />
          <br />
          <textarea
            placeholder="Description"
            value={updatedDog.description}
            onChange={(e) =>
              setUpdatedDog({ ...updatedDog, description: e.target.value })
            }
          />
          <br />
          <input
            type="number"
            placeholder="Age"
            value={updatedDog.age}
            onChange={(e) =>
              setUpdatedDog({ ...updatedDog, age: parseInt(e.target.value) })
            }
          />
          <br />
          <select
            value={updatedDog.gender}
            onChange={(e) =>
              setUpdatedDog({ ...updatedDog, gender: e.target.value })
            }
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <br />
          <input type="file" onChange={handleImageUpload} />
          <button onClick={handleUpdateDog}>Update</button>
          <button onClick={() => setEditingDog(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default DogListPage;
