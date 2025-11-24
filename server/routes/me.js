// routes/me.js
import express from "express";
import { users } from "../cache/users.js";

const router = express.Router();

router.get("/me", (req, res) => {
  const userId = req.cookies.user_id;

  if (userId && users[userId]) {
    return res.json({ loggedIn: true, userId });
  }

  res.json({ loggedIn: false });
});

export default router;
