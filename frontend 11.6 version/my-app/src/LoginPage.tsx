// src/pages/LoginPage.tsx
import React, { useState, useEffect } from "react";
import { login, LoginRequest, LoginResponse, getUsers } from "./api";

const LoginPage: React.FC<{ setIsLoggedIn: (value: boolean) => void }> = ({
  setIsLoggedIn,
}) => {
  const [isLoggedIn, setIsLogged] = useState(
    localStorage.getItem("isLoggedIn") === "true",
  );

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        const matchingUser = users.find((user) => user.username === name);
        if (matchingUser) {
          setRole(matchingUser.role);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [name]);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn.toString());
  }, [isLoggedIn]);

  const handleLogin = async () => {
    try {
      const loginData: LoginRequest = {
        username: name,
        password: password,
      };
      const response: LoginResponse = await login(loginData);

      localStorage.setItem("token", response.token);

      if (localStorage.getItem("token")) {
        localStorage.setItem("role", role || "");
        localStorage.setItem("name", name);

        setIsLoggedIn(true);
        setIsLogged(true);
        window.location.reload();
        //alert("Already Logged In");
        alert(`Logged in as user with role: ${role}`);
      }
    } catch (error) {
      console.error("Login Fail:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setIsLogged(false);
    window.location.reload();
    alert("Already Logged Out");
  };
  return (
    <div>
      <h2>Login</h2>
      {!isLoggedIn ? (
        <>
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
        </>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
    </div>
  );
};

export default LoginPage;
