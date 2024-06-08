import express, { Express, Request, Response } from "express";
import { Dog, User, Message } from "./types";
import bodyParser from "body-parser";

import swaggerUi from "swagger-ui-express";
import * as fs from "fs";
import cors from "cors";

const app: Express = express();
const port = 3000;

import * as sqlite3 from "sqlite3";
const db = new sqlite3.Database("database.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      dogId TEXT NOT NULL,
      role TEXT NOT NULL,
      FOREIGN KEY (dogId) REFERENCES dogs(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS dogs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      imageUrl TEXT NOT NULL
    )
  `);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const swaggerDocument = JSON.parse(fs.readFileSync("openapi.json", "utf8"));
let doglastId = -1;
let userlastId = -1;
let dogs: Dog[] = [];
let users: User[] = [];
let messages: Message[] = [];

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/dogs", (req: Request, res: Response) => {
  res.status(200).json(dogs);
});

// Create a dog
app.post("/dogs", (req: Request, res: Response) => {
  const newDog: Dog = req.body;

  const createdDog: Dog = {
    id: (++doglastId).toString(),
    name: newDog.name,
    description: newDog.description,
    age: newDog.age,
    gender: newDog.gender,
    imageUrl: newDog.imageUrl,
  };
  dogs.push(createdDog);
  res.status(201).json(createdDog);
});

// Get a single dog
app.get("/dogs/:id", (req: Request, res: Response) => {
  const dogId = req.params.id;
  const dog = dogs.find((u) => u.id === dogId);
  if (dog) {
    res.status(200).json(dog);
  } else {
    res.status(404).json({ message: "Dog not found" });
  }
});

app.put("/dogs/:id", (req: Request, res: Response) => {
  const dogId = req.params.id;
  const updateData: Dog = req.body;
  const dogIndex = dogs.findIndex((u) => u.id === dogId);
  if (dogIndex !== -1) {
    dogs[dogIndex] = {
      id: dogId,
      name: updateData.name,
      description: updateData.description,
      age: updateData.age,
      gender: updateData.gender,
      imageUrl: updateData.imageUrl,
    };
    res.status(200).json(dogs[dogIndex]);
  } else {
    res.status(404).json({ message: "Dog not found" });
  }
});

// Delete a dog
app.delete("/dogs/:id", (req: Request, res: Response) => {
  const dogId = req.params.id;
  const dogIndex = dogs.findIndex((u) => u.id === dogId);
  if (dogIndex !== -1) {
    dogs.splice(dogIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Dog not found" });
  }
});

app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (user) {
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

app.get("/users", (req: Request, res: Response) => {
  res.status(200).json(users);
});

app.post("/users", (req: Request, res: Response) => {
  const newUser: User = req.body;

  const createdUser: User = {
    id: (++userlastId).toString(),
    username: newUser.username,
    email: newUser.email,
    password: newUser.password,
    dogId: newUser.dogId,
    role: newUser.role,
  };
  users.push(createdUser);
  res.status(201).json(createdUser);
});

// Get a single user
app.get("/users/:userId", (req: Request, res: Response) => {
  const userId = req.params.userId;
  const user = users.find((u) => u.id === userId);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.put("/users/:userId", (req: Request, res: Response) => {
  const userId = req.params.userId;
  const updateData: User = req.body;
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = {
      id: userId,
      username: updateData.username,
      email: updateData.email,
      password: updateData.password,
      dogId: updateData.dogId,
      role: updateData.role,
    };
    res.status(200).json(users[userIndex]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Delete a user
app.delete("/users/:userId", (req: Request, res: Response) => {
  const userId = req.params.userId;
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.get("/messages", (req: Request, res: Response) => {
  res.status(200).json(messages);
});

app.post("/messages", (req: Request, res: Response) => {
  const newMessage: Message = req.body;

  const createdMessage: Message = {
    id: (++userlastId).toString(),
    userId: newMessage.userId,
    content: newMessage.content,
    createdAt: newMessage.createdAt,
  };
  messages.push(createdMessage);
  res.status(201).json(createdMessage);
});

// Get a single message
app.get("/messages/:messageId", (req: Request, res: Response) => {
  const messageId = req.params.messageId;
  const message = messages.find((u) => u.id === messageId);
  if (message) {
    res.status(200).json(message);
  } else {
    res.status(404).json({ message: "Message not found" });
  }
});

app.put("/messages/:messageId", (req: Request, res: Response) => {
  const messageId = req.params.messageId;
  const updateData: Message = req.body;
  const messageIndex = messages.findIndex((u) => u.id === messageId);
  if (messageIndex !== -1) {
    messages[messageIndex] = {
      id: messageId,
      userId: updateData.userId,
      content: updateData.content,
      createdAt: updateData.createdAt,
    };
    res.status(200).json(messages[messageIndex]);
  } else {
    res.status(404).json({ message: "Message not found" });
  }
});

// Delete a user
app.delete("/messages/:messageId", (req: Request, res: Response) => {
  const messageId = req.params.messageId;
  const messageIndex = messages.findIndex((u) => u.id === messageId);
  if (messageIndex !== -1) {
    messages.splice(messageIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Message not found" });
  }
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
