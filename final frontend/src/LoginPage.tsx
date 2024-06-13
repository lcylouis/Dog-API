// src/pages/LoginPage.tsx
import React, { useState, useEffect } from "react";
import { login, LoginRequest, LoginResponse, getUsers } from "./api";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";

//import { useGoogleLogin } from "@react-oauth/google";
import styles from "./LoginPage.module.css";

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
    alert("Logged Out");
  };

  const onGoogleLoginSuccess = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline,
  ) => {
    console.log("Google Login Success:", response);
  };

  const onGoogleLoginFailure = (error: Error) => {
    // Specify the error type as Error
    console.error("Google Login Fail:", error);
  };

  return (
    <div className={styles.container}>
      {!isLoggedIn ? (
        <>
          <GoogleLogin
            clientId="283921769585-h5kfd4e6bb2g4hotqs7qe3blh2tvfep2.apps.googleusercontent.com"
            onSuccess={onGoogleLoginSuccess}
            onFailure={onGoogleLoginFailure}
            cookiePolicy={"single_host_origin"}
          />
          <input
            className={styles.inputField}
            type="name"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className={styles.inputField}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className={styles.loginButton} onClick={handleLogin}>
            Login
          </button>
        </>
      ) : (
        <>
          <h1>Welcome! User: {localStorage.getItem("name")}</h1>
          <button className={styles.loginButton} onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default LoginPage;
