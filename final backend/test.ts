import request from "supertest";
import assert from "assert";
import { describe, it } from "mocha";
import app from "./server";

describe("Dogs API", () => {
  describe("GET /dogs", () => {
    it("should return a list of dogs", async () => {
      const response = await request(app).get("/dogs");
      assert.equal(response.status, 200);
      assert.ok(Array.isArray(response.body));
    });
  });

  describe("POST /dogs", () => {
    it("should create a new dog", async () => {
      const newDog = {
        name: "Test Dog",
        description: "This is a test dog",
        age: 3,
        gender: "male",
        imageUrl: "https://example.com/dog.jpg",
      };
      const response = await request(app).post("/dogs").send(newDog);
      assert.equal(response.status, 201);
      assert.ok(response.body.id); // Ensure the response has an 'id' property
      assert.deepEqual(response.body, {
        id: response.body.id, // Use the generated 'id' from the response
        ...newDog,
      });
    });
  });
  describe("GET /dogs/:id", () => {
    it("should return a single dog", async () => {
      const newDog = {
        name: "Test Dog",
        description: "This is a test dog",
        age: 3,
        gender: "male",
        imageUrl: "https://example.com/dog.jpg",
      };
      const postResponse = await request(app).post("/dogs").send(newDog);
      const dogId = postResponse.body.id;

      const getResponse = await request(app).get(`/dogs/${dogId}`);
      assert.equal(getResponse.status, 200);
      assert.deepEqual(getResponse.body, {
        id: dogId,
        ...newDog,
      });
    });

    it("should return 404 if dog not found", async () => {
      const response = await request(app).get("/dogs/999");
      assert.equal(response.status, 404);
      assert.deepEqual(response.body, { message: "Dog not found" });
    });
  });

  describe("PUT /dogs/:id", () => {
    it("should update an existing dog", async () => {
      const newDog = {
        name: "Test Dog",
        description: "This is a test dog",
        age: 3,
        gender: "male",
        imageUrl: "https://example.com/dog.jpg",
      };
      const postResponse = await request(app).post("/dogs").send(newDog);
      const dogId = postResponse.body.id;

      const updatedDog = {
        name: "Updated Test Dog",
        description: "This is an updated test dog",
        age: 4,
        gender: "female",
        imageUrl: "https://example.com/updated-dog.jpg",
      };
      const putResponse = await request(app)
        .put(`/dogs/${dogId}`)
        .send(updatedDog);
      assert.equal(putResponse.status, 200);
      assert.deepEqual(putResponse.body, {
        id: dogId,
        ...updatedDog,
      });
    });

    it("should return 404 if dog not found", async () => {
      const updatedDog = {
        name: "Updated Test Dog",
        description: "This is an updated test dog",
        age: 4,
        gender: "female",
        imageUrl: "https://example.com/updated-dog.jpg",
      };
      const response = await request(app).put("/dogs/999").send(updatedDog);
      assert.equal(response.status, 404);
      assert.deepEqual(response.body, { message: "Dog not found" });
    });
  });

  describe("DELETE /users/:userId", () => {
    it("should delete an existing dog", async () => {
      const existingDog = {
        id: 1,
        name: "Test Dog",
        description: "This is a test dog",
        age: 3,
        gender: "male",
        imageUrl: "https://example.com/dog.jpg",
      };
      const response = await request(app).delete(`/dogs/${existingDog.id}`);
      assert.equal(response.status, 204);

      const getResponse = await request(app).get(`/dogs/${existingDog.id}`);
      assert.equal(getResponse.status, 404);
      assert.deepEqual(getResponse.body, { message: "Dog not found" });
    });
  });
});

describe("Authentication and User API", () => {
  describe("POST /login", () => {
    it("should login a user with valid credentials", async () => {
      const validUser = {
        username: "testuser",
        password: "validpassword",
      };
      const response = await request(app).post("/login").send(validUser);
      assert.equal(response.status, 200);
      assert.deepEqual(response.body, { message: "Login successful" });
    });

    it("should return 401 for invalid credentials", async () => {
      const invalidUser = {
        username: "testuser",
        password: "invalidpassword",
      };
      const response = await request(app).post("/login").send(invalidUser);
      assert.equal(response.status, 401);
      assert.deepEqual(response.body, {
        message: "Invalid username or password",
      });
    });
  });

  describe("GET /users", () => {
    it("should return a list of users", async () => {
      const response = await request(app).get("/users");
      assert.equal(response.status, 200);
      assert.ok(Array.isArray(response.body));
    });
  });

  describe("POST /users", () => {
    it("should create a new user", async () => {
      const newUser = {
        username: "newuser",
        email: "newuser@example.com",
        password: "newpassword",
        role: "public",
      };
      const response = await request(app).post("/users").send(newUser);
      assert.equal(response.status, 201);
      assert.ok(response.body.id);
      assert.deepEqual(response.body, {
        id: response.body.id,
        ...newUser,
      });
    });
  });

  describe("GET /users/:userId", () => {
    it("should return a single user", async () => {
      const existingUser = {
        id: 0,
        username: "newuser",
        email: "newuser@example.com",
        password: "newpassword",
        role: "public",
      };

      const response = await request(app).get(`/users/${existingUser.id}`);

      assert.equal(response.status, 200);
      assert.deepEqual(response.body, existingUser);
    });

    it("should return 404 for non-existent user", async () => {
      const nonExistentUserId = 999;
      const response = await request(app).get(`/users/${nonExistentUserId}`);
      assert.equal(response.status, 404);
      assert.deepEqual(response.body, { message: "User not found" });
    });
  });

  describe("PUT /users/:userId", () => {
    it("should update an existing user", async () => {
      const existingUser = {
        id: 0,
        username: "newuser",
        email: "newuser@example.com",
        password: "newpassword",
        role: "user",
      };

      const updatedUser = {
        username: "updateduser",
        email: "updateduser@example.com",
        password: "updatedpassword",
        role: "admin",
      };
      const response = await request(app)
        .put(`/users/${existingUser.id}`)
        .send(updatedUser);

      assert.equal(response.status, 200);
      assert.deepEqual(response.body, {
        id: existingUser.id,
        ...updatedUser,
      });
    });
  });

  describe("DELETE /users/:userId", () => {
    it("should delete an existing user", async () => {
      const existingUser = {
        id: 1,
        username: "testuser",
        email: "testuser@example.com",
        password: "testpassword",
        role: "user",
      };

      const response = await request(app).delete(`/users/${existingUser.id}`);
      assert.equal(response.status, 204);

      const getResponse = await request(app).get(`/users/${existingUser.id}`);
      assert.equal(getResponse.status, 404);
      assert.deepEqual(getResponse.body, { message: "User not found" });
    });
  });
});

describe("Messages API", () => {
  describe("GET /messages", () => {
    it("should return a list of messages", async () => {
      const response = await request(app).get("/messages");
      assert.equal(response.status, 200);
      assert.ok(Array.isArray(response.body));
    });
  });

  describe("POST /messages", () => {
    it("should create a new message", async () => {
      const newMessage = {
        userId: "1",
        dogId: "1",
        send: "Hello, dog!",
        sendAt: "2023-06-11T12:00:00",
        reply: "Woof!",
        replyAt: "2023-06-11T12:01:00",
      };
      const response = await request(app).post("/messages").send(newMessage);
      assert.equal(response.status, 201);
      assert.ok(response.body.id);
      assert.deepEqual(response.body, {
        id: response.body.id,
        ...newMessage,
      });
    });
  });
  describe("GET /messages/:messageId", () => {
    it("should return a single message", async () => {
      const newMessage = {
        userId: "1",
        dogId: "1",
        send: "Hello, dog!",
        sendAt: "2023-06-11T12:00:00",
        reply: "Woof!",
        replyAt: "2023-06-11T12:01:00",
      };
      const postResponse = await request(app)
        .post("/messages")
        .send(newMessage);
      const messageId = postResponse.body.id;

      const getResponse = await request(app).get(`/messages/${messageId}`);
      assert.equal(getResponse.status, 200);
      assert.deepEqual(getResponse.body, {
        id: messageId,
        ...newMessage,
      });
    });
  });

  describe("PUT /messages/:messageId", () => {
    it("should update an existing message", async () => {
      const existingMessage = {
        id: 0,
        userId: "3",
        dogId: "3",
        send: "Hello, dog!",
        sendAt: "2023-06-11T12:00:00",
        reply: "Woof!",
        replyAt: "2023-06-11T12:01:00",
      };
      const postResponse = await request(app)
        .post("/messages")
        .send(existingMessage);

      const updatedMessage = {
        userId: "3",
        dogId: "3",
        send: "Hi, dog!",
        sendAt: "2023-06-11T12:01:02",
        reply: "Woof...",
        replyAt: "2023-06-11T12:01:10",
      };

      assert.equal(postResponse.status, 200);
      assert.deepEqual(postResponse.body, {
        id: existingMessage.id,
        ...updatedMessage,
      });
    });
  });

  describe("DELETE /messages/:messageId", () => {
    it("should delete a message", async () => {
      const newMessage = {
        userId: "1",
        dogId: "1",
        send: "Hello, dog!",
        sendAt: "2023-06-11T12:00:00",
        reply: "Woof!",
        replyAt: "2023-06-11T12:01:00",
      };
      const postResponse = await request(app)
        .post("/messages")
        .send(newMessage);
      const messageId = postResponse.body.id;

      const deleteResponse = await request(app).delete(
        `/messages/${messageId}`,
      );
      assert.equal(deleteResponse.status, 204);

      const getResponse = await request(app).get(`/messages/${messageId}`);
      assert.equal(getResponse.status, 404);
    });
  });
});

describe("Doglists API", () => {
  describe("GET /doglists", () => {
    it("should return a list of doglists", async () => {
      const response = await request(app).get("/doglists");
      assert.equal(response.status, 200);
      assert.ok(Array.isArray(response.body));
    });
  });

  describe("POST /doglists", () => {
    it("should create a new doglist", async () => {
      const newDoglist = {
        userId: "1",
        dogId: "1",
      };
      const response = await request(app).post("/doglists").send(newDoglist);
      assert.equal(response.status, 201);
      assert.ok(response.body.id);
      assert.deepEqual(response.body, {
        id: response.body.id,
        ...newDoglist,
      });
    });
  });
  describe("GET /doglists/:id", () => {
    it("should return a doglist by id", async () => {
      // Create a new doglist first
      const newDoglist = {
        userId: "1",
        dogId: "1",
      };
      const createResponse = await request(app)
        .post("/doglists")
        .send(newDoglist);
      assert.equal(createResponse.status, 201);
      const doglistId = createResponse.body.id;

      // Test the GET /doglists/:id endpoint
      const getResponse = await request(app).get(`/doglists/${doglistId}`);
      assert.equal(getResponse.status, 200);
      assert.deepEqual(getResponse.body, { ...newDoglist, id: doglistId });
    });

    it("should return 404 if doglist not found", async () => {
      const response = await request(app).get("/doglists/non-existing-id");
      assert.equal(response.status, 404);
      assert.deepEqual(response.body, { message: "Doglist not found" });
    });
  });

  describe("PUT /doglists/:id", () => {
    it("should update a doglist", async () => {
      // Create a new doglist first
      const newDoglist = {
        userId: "1",
        dogId: "1",
      };
      const createResponse = await request(app)
        .post("/doglists")
        .send(newDoglist);
      assert.equal(createResponse.status, 201);
      const doglistId = createResponse.body.id;

      // Test the PUT /doglists/:id endpoint
      const updatedDoglist = {
        userId: "2",
        dogId: "2",
      };
      const putResponse = await request(app)
        .put(`/doglists/${doglistId}`)
        .send(updatedDoglist);
      assert.equal(putResponse.status, 200);
      assert.deepEqual(putResponse.body, { id: doglistId, ...updatedDoglist });
    });
  });

  describe("DELETE /doglists/:id", () => {
    it("should delete a doglist", async () => {
      // Create a new doglist first
      const newDoglist = {
        userId: "1",
        dogId: "1",
      };
      const createResponse = await request(app)
        .post("/doglists")
        .send(newDoglist);
      assert.equal(createResponse.status, 201);
      const doglistId = createResponse.body.id;

      // Test the DELETE /doglists/:id endpoint
      const deleteResponse = await request(app).delete(
        `/doglists/${doglistId}`,
      );
      assert.equal(deleteResponse.status, 204);

      // Verify the doglist has been deleted
      const getResponse = await request(app).get(`/doglists/${doglistId}`);
      assert.equal(getResponse.status, 404);
      assert.deepEqual(getResponse.body, { message: "Doglist not found" });
    });
  });
});
