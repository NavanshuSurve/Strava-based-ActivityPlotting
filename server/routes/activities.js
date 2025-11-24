// routes/activities.js
import express from "express";
import axios from "axios";
import { ensureFreshToken } from "../services/tokenService.js";

const router = express.Router();

// Get activities
router.get("/", async (req, res) => {
  const userId = req.cookies.user_id;
  const user = await ensureFreshToken(userId);

  if (!user) return res.status(401).json({ error: "Not logged in" });

  try {
    const acts = await axios.get(
      "https://www.strava.com/api/v3/athlete/activities",
      { headers: { Authorization: `Bearer ${user.access_token}` } }
    );

    res.json(acts.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

// Get single activity stream
router.get("/:id", async (req, res) => {
  const userId = req.cookies.user_id;
  const user = await ensureFreshToken(userId);
  if (!user) return res.status(401).json({ error: "Not logged in" });

  try {
    const stream = await axios.get(
      `https://www.strava.com/api/v3/activities/${req.params.id}/streams?keys=latlng,time,distance&key_by_type=true`,
      { headers: { Authorization: `Bearer ${user.access_token}` } }
    );

    res.json(stream.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch streams" });
  }
});

export default router;
