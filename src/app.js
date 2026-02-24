const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // allow JSON body

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Hardware backend is running ✅" });
});

// Routes
app.use("/api/products", productRoutes);

module.exports = app;