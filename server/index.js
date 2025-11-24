// index.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.get('/',async(req,res)=>{try{
  res.json({message:"backend working"})
}
  catch(err)
  {
    res.json({
      message:err
    })
  }
})
import authRouter from "./routes/auth.js";
import activitiesRouter from "./routes/activities.js";
import meRouter from "./routes/me.js";
import globalMapRouter from "./routes/globalmap.js"

app.use("/auth", authRouter);
app.use("/api/globalmap", globalMapRouter)
app.use("/api/activities", activitiesRouter);
app.use("/api", meRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚴 Server running on http://localhost:${PORT}`));
