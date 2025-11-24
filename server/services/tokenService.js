// services/tokenService.js
import axios from "axios";
import { users } from "../cache/users.js";

export async function ensureFreshToken(userId) {
  const user = users[userId];
  if (!user) return null;

  const now = Math.floor(Date.now() / 1000);

  if (user.expires_at > now) return user;

  // refresh token
  const res = await axios.post("https://www.strava.com/api/v3/oauth/token", {
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: user.refresh_token
  });

  user.access_token = res.data.access_token;
  user.refresh_token = res.data.refresh_token;
  user.expires_at = res.data.expires_at;

  return user;
}
