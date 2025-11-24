import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function LoginButton() {
  const navigate = useNavigate();

  // 👇 Check on mount if user is already logged in (cookie exists)
  useEffect(() => {
    api.get("/api/me").then(res => {
      if (res.data.loggedIn) {
        navigate("/dashboard");
      }
      
    });
  }, [navigate]);

  const handleLogin = () => {
    // Redirect to backend to start Strava OAuth
    window.location.href = "http://localhost:4000/auth/strava";
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column"
    }}>
      <h1>Strava Region Capture 🏃‍♂️</h1>
      <button
        onClick={handleLogin}
        style={{
          backgroundColor: "#fc4c02",
          color: "white",
          fontSize: "1.2rem",
          padding: "12px 24px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Connect with Strava
      </button>
    </div>
  );
}

export default LoginButton;
