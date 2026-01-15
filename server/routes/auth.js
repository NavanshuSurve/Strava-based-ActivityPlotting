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
    scope: "read,activity:read",
  });

  res.redirect(`https://www.strava.com/oauth/authorize?${params}`);
});

router.get("/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const tokenRes = await axios.post("https://www.strava.com/oauth/token", {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    });

    const { access_token, refresh_token, expires_at, athlete } = tokenRes.data;
    const athleteId = String(athlete.id);

    // Store in memory (for development)
    users[athleteId] = { access_token, refresh_token, expires_at };

    res.cookie("user_id", athleteId, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true in production with HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    });

    res.redirect("http://localhost:5173/dashboard");
  } catch (err) {
    console.error("OAuth error:", err.response?.data || err.message);
    res.status(500).send("OAuth Error");
  }
});

export default router;
