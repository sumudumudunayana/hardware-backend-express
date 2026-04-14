const express = require("express");
const router = express.Router();

const { predictAI } = require("../controllers/aiController");

router.post("/predict", predictAI);

module.exports = router;