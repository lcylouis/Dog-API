// src/pages/DogDetailsPage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Dog } from "./types";

const DogDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dog, setDog] = useState<Dog | null>(null);

  useEffect(() => {
    const fetchDog = async () => {
      try {
        const response = await axios.get(`/api/dogs/${id}`);
        setDog(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDog();
  }, [id]);

  if (!dog) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{dog.name}</h1>
      <img src={dog.imageUrl} alt={dog.name} />
      <p>{dog.description}</p>
      <p>Age: {dog.age}</p>
      <p>Gender: {dog.gender}</p>
      <p>Size: {dog.size}</p>
    </div>
  );
};

export default DogDetailsPage;
