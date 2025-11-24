import express from "express";
const router = express.Router();
router.use(express.json());

let storedRoutes=[];

router.post("/", (req, res) => {
  console.log("Received data:", req.body);
  storedRoutes.push(req.body.key);
  res.json({
    status: "ok",
    storedCount:storedRoutes.length,
  });
});
router.get("/", (req, res) => {
  console.log("Received data:", req.body);
  
  res.json({
    routes:storedRoutes,
  });
});

export default router;
