import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/me").then(res => {
      if (res.data.loggedIn) {
        navigate("/dashboard");
      } else {
        window.location.href = "http://localhost:4000/auth/strava";
      }
    });
  }, []);

  return <p>Checking login…</p>;
}
