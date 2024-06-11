// src/pages/FavoritesPage.tsx
import React, { useState, useEffect } from "react";
import {
  getDogs,
  Dog,
  Doglist,
  getUsers,
  deleteDoglist,
  MessageRequest,
  getDoglists,
  updateMessage,
  createMessage,
  getMessages,
} from "./api";

const FavoritesPage: React.FC = () => {
  const [messages, setMessages] = useState<{ [dogId: string]: MessageRequest }>(
    {},
  );
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [userDoglists, setUserDoglists] = useState<{
    [dogId: string]: Doglist;
  }>({});

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [newMessages, setNewMessages] = useState<{
    [dogId: string]: MessageRequest;
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const username = await localStorage.getItem("name");
          if (username) {
            const users = await getUsers();
            const user = users.find((u) => u.username === username);
            if (user) {
              const messages = await getMessages();
              const userMessages: { [dogId: string]: MessageRequest } = {};
              messages.forEach((message) => {
                if (message.userId === user.id) {
                  userMessages[message.dogId] = message;
                }
              });
              setMessages(userMessages);

              const doglists = await getDoglists();
              const userDoglists: { [dogId: string]: Doglist } = {};
              doglists.forEach((doglist) => {
                if (doglist.userId === user.id) {
                  userDoglists[doglist.dogId] = doglist;
                }
              });
              setUserDoglists(userDoglists);

              const dogIds = Object.keys(userDoglists);
              const userDogs = await getDogs();
              let filteredDogs = userDogs.filter((dog) =>
                dogIds.includes(dog.id),
              );

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
        } else {
          console.error("Token not found in localStorage.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [filters]);

  const handleSearch = () => {
    setFilters({ ...filters, name: searchTerm });
  };

  const handleAddButtonClick = (dog: Dog) => {
    handleRemoveDog(dog);
  };

  const handleRemoveDog = async (dog: Dog) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const username = await localStorage.getItem("name");
        if (username) {
          const users = await getUsers();
          const user = users.find((u) => u.username === username);
          if (user) {
            const doglist = userDoglists[dog.id];
            if (doglist) {
              await deleteDoglist(doglist.id);
              const updatedUserDoglists = { ...userDoglists };
              delete updatedUserDoglists[dog.id];
              setUserDoglists(updatedUserDoglists);
              setDogs(dogs.filter((d) => d.id !== dog.id));
              alert(`Removed ${dog.name} from your favourite list!`);
            } else {
              alert(`${dog.name} is not in your favourite list.`);
            }
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
      console.error("Error deleting doglist:", error);
    }
  };

  const handlecreateMessage = async (dogId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const username = await localStorage.getItem("name");
        if (username) {
          const users = await getUsers();
          const user = users.find((u) => u.username === username);
          if (user) {
            const message: MessageRequest = {
              id: "",
              userId: user.id,
              dogId,
              send: newMessages[dogId]?.send || "",
              sendAt: new Date().toISOString(),
              reply: "",
              replyAt: "",
            };

            const existingMessages = await getMessages();
            const existingMessage = existingMessages.find(
              (m) => m.userId === user.id && m.dogId === dogId,
            );
            if (existingMessage) {
              await updateMessage(existingMessage.id, message);
            } else {
              await createMessage(message);
            }
            setNewMessages((prevMessages) => ({
              ...prevMessages,
              [dogId]: {
                ...prevMessages[dogId],
                send: newMessages[dogId]?.send,
              },
            }));
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
      console.error("Error sending message:", error);
    }
  };

  const handleSendMessage = (dogId: string) => {
    handlecreateMessage(dogId);
  };

  return (
    <div>
      <h1>Favourite List</h1>
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
              <button onClick={(event) => handleAddButtonClick(dog)}>
                Delete from Favorites
              </button>

              <div>
                <input
                  type="text"
                  placeholder={messages[dog.id]?.send || "Not Upload"}
                  value={newMessages[dog.id]?.send || ""}
                  onChange={(e) =>
                    setNewMessages((prevMessages) => ({
                      ...prevMessages,
                      [dog.id]: {
                        ...prevMessages[dog.id],
                        dogId: dog.id,
                        send: e.target.value,
                      },
                    }))
                  }
                />

                <button onClick={() => handleSendMessage(dog.id)}>
                  Upload Your Reaction
                </button>
                <p>
                  Charities Replies: {messages[dog.id]?.reply || "Not Reply"}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesPage;
