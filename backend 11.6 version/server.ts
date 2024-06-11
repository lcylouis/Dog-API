import express, { Express, Request, Response } from "express";
import { Dog, User, Message, Doglist } from "./types";
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
      role TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS doglists (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      dogId TEXT NOT NULL
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

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      dogId TEXT NOT NULL,
      send TEXT NOT NULL,
      sendAt INTEGER NOT NULL,
      reply TEXT NOT NULL,
      replyAt TEXT NOT NULL
    )
  `);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const swaggerDocument = JSON.parse(fs.readFileSync("openapi.json", "utf8"));
let doglastId = -1;
let userlastId = -1;
let doglistlastId = -1;
let messagelastId = -1;

let messages: Message[] = [];

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/dogs", (req: Request, res: Response) => {
  db.all("SELECT * FROM dogs", (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching dogs" });
    } else {
      res.status(200).json(rows);
    }
  });
});

// Create a dog
app.post("/dogs", (req: Request, res: Response) => {
  const newDog: Dog = req.body;
  db.run(
    "INSERT INTO dogs (id, name, description, age, gender, imageUrl) VALUES (?, ?, ?, ?, ?, ?)",
    [
      (++doglastId).toString(),
      newDog.name,
      newDog.description,
      newDog.age,
      newDog.gender,
      newDog.imageUrl,
    ],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating dog" });
      } else {
        const createdDog: Dog = {
          id: doglastId.toString(),
          name: newDog.name,
          description: newDog.description,
          age: newDog.age,
          gender: newDog.gender,
          imageUrl: newDog.imageUrl,
        };
        res.status(201).json(createdDog);
      }
    },
  );
});

// Get a single dog
app.get("/dogs/:id", (req: Request, res: Response) => {
  const dogId = req.params.id;
  db.get("SELECT * FROM dogs WHERE id = ?", [dogId], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching dog" });
    } else if (row) {
      res.status(200).json(row);
    } else {
      res.status(404).json({ message: "Dog not found" });
    }
  });
});

app.put("/dogs/:id", (req: Request, res: Response) => {
  const dogId = req.params.id;
  const updateData: Dog = req.body;
  db.run(
    "UPDATE dogs SET name = ?, description = ?, age = ?, gender = ?, imageUrl = ? WHERE id = ?",
    [
      updateData.name,
      updateData.description,
      updateData.age,
      updateData.gender,
      updateData.imageUrl,
      dogId,
    ],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating dog" });
      } else {
        db.get("SELECT * FROM dogs WHERE id = ?", [dogId], (err, row) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching updated dog" });
          } else if (row) {
            res.status(200).json(row);
          } else {
            res.status(404).json({ message: "Dog not found" });
          }
        });
      }
    },
  );
});

// Delete a dog
app.delete("/dogs/:id", (req: Request, res: Response) => {
  const dogId = req.params.id;
  db.run("DELETE FROM dogs WHERE id = ?", [dogId], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error deleting dog" });
    } else {
      res.status(204).send();
    }
  });
});

app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching user" });
      }

      if (user) {
        res.status(200).json({ message: "Login successful" });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    },
  );
});

app.get("/users", (req: Request, res: Response) => {
  db.all("SELECT * FROM users", (err, users) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching users" });
    }

    res.status(200).json(users);
  });
});

app.post("/users", (req: Request, res: Response) => {
  const newUser: User = req.body;

  db.run(
    "INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)",
    [
      (++userlastId).toString(),
      newUser.username,
      newUser.email,
      newUser.password,
      newUser.role,
    ],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error creating user" });
      }

      const createdUser: User = {
        id: (++userlastId).toString(),
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
      };
      res.status(201).json(createdUser);
    },
  );
});

// Get a single user
app.get("/users/:userId", (req: Request, res: Response) => {
  const userId = req.params.userId;
  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
    if (err) {
      res.status(500).json({ message: "Error retrieving user" });
    } else if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(user);
    }
  });
});

app.put("/users/:userId", (req: Request, res: Response) => {
  const userId = req.params.userId;
  const updateData: User = req.body;
  db.run(
    "UPDATE users SET username = ?, email = ?, password = ?, role = ? WHERE id = ?",
    [
      updateData.username,
      updateData.email,
      updateData.password,
      updateData.role,
      userId,
    ],
    (err) => {
      if (err) {
        res.status(500).json({ message: "Error updating user" });
      } else {
        db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
          if (err) {
            res.status(500).json({ message: "Error retrieving user" });
          } else {
            res.status(200).json(user);
          }
        });
      }
    },
  );
});

// Delete a user
app.delete("/users/:userId", (req: Request, res: Response) => {
  const userId = req.params.userId;
  db.run("DELETE FROM users WHERE id = ?", [userId], (err) => {
    if (err) {
      res.status(500).json({ message: "Error deleting user" });
    } else {
      res.status(204).send();
    }
  });
});

app.get("/messages", (req: Request, res: Response) => {
  db.all("SELECT * FROM messages", (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching doglists" });
    } else {
      res.status(200).json(rows);
    }
  });
});

app.post("/messages", (req: Request, res: Response) => {
  const newMessage: Message = req.body;
  db.run(
    "INSERT INTO messages (id, userId, dogId, send, sendAt, reply, replyAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      (++messagelastId).toString(),
      newMessage.userId,
      newMessage.dogId,
      newMessage.send,
      newMessage.sendAt,
      newMessage.reply,
      newMessage.replyAt,
    ],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating message" });
      } else {
        const createdMessage: Message = {
          id: messagelastId.toString(),
          userId: newMessage.userId,
          dogId: newMessage.dogId,
          send: newMessage.send,
          sendAt: newMessage.sendAt,
          reply: newMessage.reply,
          replyAt: newMessage.replyAt,
        };
        res.status(201).json(createdMessage);
      }
    },
  );
});

// Get a single message
app.get("/messages/:messageId", (req: Request, res: Response) => {
  const messageId = req.params.messageId;
  db.get("SELECT * FROM messages WHERE id = ?", [messageId], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching message" });
    } else if (row) {
      res.status(200).json(row);
    } else {
      res.status(404).json({ message: "Message not found" });
    }
  });
});

app.put("/messages/:messageId", (req: Request, res: Response) => {
  const messageId = req.params.messageId;
  const updateData: Message = req.body;
  db.run(
    "UPDATE messages SET userId = ?, dogId = ?, send = ?, sendAt = ?, reply = ?, replyAt = ? WHERE id = ?",
    [
      updateData.userId,
      updateData.dogId,
      updateData.send,
      updateData.sendAt,
      updateData.reply,
      updateData.replyAt,
      messageId,
    ],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating message" });
      } else {
        db.get(
          "SELECT * FROM messages WHERE id = ?",
          [messageId],
          (err, row) => {
            if (err) {
              console.error(err);
              res
                .status(500)
                .json({ message: "Error fetching updated message" });
            } else if (row) {
              res.status(200).json(row);
            } else {
              res.status(404).json({ message: "Message not found" });
            }
          },
        );
      }
    },
  );
});

// Delete a message
app.delete("/messages/:messageId", (req: Request, res: Response) => {
  const messageId = req.params.messageId;
  db.run("DELETE FROM messages WHERE id = ?", [messageId], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error deleting message" });
    } else {
      res.status(204).send();
    }
  });
});

app.get("/doglists", (req: Request, res: Response) => {
  db.all("SELECT * FROM doglists", (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching doglists" });
    } else {
      res.status(200).json(rows);
    }
  });
});

app.post("/doglists", (req: Request, res: Response) => {
  const newDoglist: Doglist = req.body;
  db.run(
    "INSERT INTO doglists (id, userId, dogId) VALUES (?, ?, ?)",
    [(++doglistlastId).toString(), newDoglist.userId, newDoglist.dogId],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating doglist" });
      } else {
        const createdDoglist: Doglist = {
          id: doglistlastId.toString(),
          userId: newDoglist.userId,
          dogId: newDoglist.dogId,
        };
        res.status(201).json(createdDoglist);
      }
    },
  );
});

app.get("/doglists/:id", (req: Request, res: Response) => {
  const doglistId = req.params.id;
  db.get("SELECT * FROM doglists WHERE id = ?", [doglistId], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching doglist" });
    } else if (row) {
      res.status(200).json(row);
    } else {
      res.status(404).json({ message: "Doglist not found" });
    }
  });
});

app.put("/doglists/:id", (req: Request, res: Response) => {
  const doglistId = req.params.id;
  const updateData: Doglist = req.body;
  db.run(
    "UPDATE doglists SET userId = ?, dogId = ? WHERE id = ?",
    [updateData.userId, updateData.dogId, doglistId],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating doglist" });
      } else {
        db.get(
          "SELECT * FROM doglists WHERE id = ?",
          [doglistId],
          (err, row) => {
            if (err) {
              console.error(err);
              res
                .status(500)
                .json({ message: "Error fetching updated doglist" });
            } else if (row) {
              res.status(200).json(row);
            } else {
              res.status(404).json({ message: "Doglist not found" });
            }
          },
        );
      }
    },
  );
});

app.delete("/doglists/:id", (req: Request, res: Response) => {
  const doglistId = req.params.id;
  db.run("DELETE FROM doglists WHERE id = ?", [doglistId], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error deleting doglist" });
    } else {
      res.status(204).send();
    }
  });
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
