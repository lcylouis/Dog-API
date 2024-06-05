import express, { Express, Request, Response } from "express";
import { User, NewUser, UpdateUser } from "./types";
import bodyParser from "body-parser";

import swaggerUi from "swagger-ui-express";
import * as fs from "fs";

const app: Express = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const swaggerDocument = JSON.parse(fs.readFileSync("openapi.json", "utf8"));
let lastUserId = 0;
let users: User[] = [];

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/users", (req: Request, res: Response) => {
  res.status(200).json(users);
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

// Create a new user
app.post("/users", (req: Request, res: Response) => {
  const newUser: NewUser = req.body;
  const createdUser: User = {
    id: (++lastUserId).toString(),
    username: newUser.username,
    email: newUser.email,
  };
  users.push(createdUser);
  res.status(201).json(createdUser);
});

app.put("/users/:userId", (req: Request, res: Response) => {
  const userId = req.params.userId;
  const updateData: UpdateUser = req.body;
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = {
      id: userId,
      username: updateData.username,
      email: updateData.email,
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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
