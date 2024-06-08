// src/pages/RegisterPage.tsx
import React, { useState, useEffect } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  User,
  UserRequest,
} from "./api";

const RegisterPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [registerCode, setRegisterCode] = useState("");
  const [newUser, setNewUser] = useState<UserRequest>({
    username: "",
    email: "",
    password: "",
    dogId: "",
    role: registerCode === "CODE" ? "admin" : "public",
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setUsers(await getUsers());
    };
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    if (
      newUser.username.trim() === "" ||
      newUser.email.trim() === "" ||
      newUser.password.trim() === ""
    ) {
      alert("Username, email and password cannot be empty.");
      return;
    }

    // 驗證username不能重複
    if (users.some((user) => user.username === newUser.username)) {
      alert("Username already exists.");
      return;
    }

    const createdUser = await createUser({
      ...newUser,
      role: registerCode === "CODE" ? "admin" : "public",
    });
    setUsers([...users, createdUser]);
    setNewUser({
      username: "",
      email: "",
      password: "",
      dogId: "",
      role: registerCode === "CODE" ? "admin" : "public",
    });
  };

  const handleUpdateUser = async () => {
    if (editingUser) {
      const updatedUser = await updateUser(editingUser.id, editingUser);
      setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      setEditingUser(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteUser(userId);
    setUsers(users.filter((u) => u.id !== userId));
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Dog ID</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.dogId}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => setEditingUser(user)}>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Create User</h2>
      <input
        type="text"
        placeholder="Register Code"
        value={registerCode}
        onChange={(e) => setRegisterCode(e.target.value)}
      />

      <br></br>
      <input
        type="text"
        placeholder="Username"
        value={newUser.username}
        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
      />
      <br></br>
      <input
        type="email"
        placeholder="Email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      />
      <br></br>
      <input
        type="password"
        placeholder="Password"
        value={newUser.password}
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
      />

      <button onClick={handleCreateUser}>Create</button>

      {editingUser && (
        <div>
          <h2>Edit User</h2>
          <input
            type="text"
            placeholder="Username"
            value={editingUser.username}
            onChange={(e) =>
              setEditingUser({ ...editingUser, username: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            value={editingUser.email}
            onChange={(e) =>
              setEditingUser({ ...editingUser, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            value={editingUser.password}
            onChange={(e) =>
              setEditingUser({ ...editingUser, password: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Dog ID"
            value={editingUser.dogId}
            onChange={(e) =>
              setEditingUser({ ...editingUser, dogId: e.target.value })
            }
          />
          <button onClick={handleUpdateUser}>Save</button>
          <button onClick={() => setEditingUser(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
