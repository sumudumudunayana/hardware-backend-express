const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const companyRoutes = require("./routes/companyRoutes");
const distributorRoutes = require("./routes/distributorRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // allow JSON body

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Hardware backend is running" });
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/distributors", distributorRoutes);

module.exports = app;