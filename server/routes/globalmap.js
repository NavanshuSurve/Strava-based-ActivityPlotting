import express from "express";
const router = express.Router();
router.use(express.json());

let storedRoutes=[];

router.post("/", (req, res) => {
  console.log("Received data:", req.body);
  storedRoutes.push(req.body);
  res.json({
    status: "ok",
    storedCount:storedRoutes.length,
  });
});
router.get("/", (req, res) => {
  console.log("Received data:", req.name);
  
  res.json({
    routes:storedRoutes,
  });
});
router.delete("/", (req, res) => {
  
  const {name}= req.body;
  storedRoutes=storedRoutes.filter(routes=>routes.name!==name)
  res.json({
    status: "ok",
    storedCount:storedRoutes.length,
  });
});

export default router;
