
// routes/auth.js
import express from "express";
import axios from "axios";
import { users } from "../cache/users.js";

const router = express.Router();

// Start OAuth
router.get("/strava", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.STRAVA_CLIENT_ID,
    redirect_uri: process.env.STRAVA_REDIRECT_URI,
    response_type: "code",
    scope: "read,activity:read_all"
  });

  res.redirect(`https://www.strava.com/oauth/authorize?${params}`);
});

// OAuth callback
router.get("/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const tokenRes = await axios.post("https://www.strava.com/oauth/token", {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code"
    });

    const { access_token, refresh_token, expires_at, athlete } = tokenRes.data;

    users[athlete.id] = { access_token, refresh_token, expires_at };

    res.cookie("user_id", athlete.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });

    res.redirect("http://localhost:5173/dashboard");
  } catch (err) {
    res.status(500).send("OAuth Error");
  }
});

export default router;
