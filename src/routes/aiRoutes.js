const express = require("express");
const router = express.Router();

const { predictAI, retrainAI } = require("../controllers/aiController");

router.post("/predict", predictAI);
router.post("/retrain", retrainAI);

module.exports = router;