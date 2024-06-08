// src/pages/LoginPage.tsx
import React, { useState, useEffect } from "react";
import { login, LoginRequest, LoginResponse } from "./api";

const LoginPage: React.FC<{ setIsLoggedIn: (value: boolean) => void }> = ({
  setIsLoggedIn,
}) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {};
    fetchUsers();
  }, []);

  const handleLogin = async () => {
    try {
      const loginData: LoginRequest = {
        username: name,
        password: password,
      };
      const response: LoginResponse = await login(loginData);
      localStorage.setItem("token", response.token);
      if (localStorage.getItem("token")) {
        setIsLoggedIn(true);
        alert("Already Logged In");
      }
    } catch (error) {
      console.error("Login Fail:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    alert("Already Logged Out");
  };
  return (
    <div>
      <h2>Login</h2>
      <input
        type="name"
        placeholder="Username"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default LoginPage;
