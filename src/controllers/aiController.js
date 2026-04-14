const axios = require("axios");

const predictAI = async (req, res) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/predict",
      req.body
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("AI prediction error:", error.message);

    res.status(500).json({
      message: "AI prediction failed",
      error: error.message,
    });
  }
};

module.exports = {
  predictAI,
};