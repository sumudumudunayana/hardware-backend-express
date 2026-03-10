const express = require("express");
const cors = require("cors");

const categoryRoutes = require("./routes/categoryRoutes");
const companyRoutes = require("./routes/companyRoutes");
const distributorRoutes = require("./routes/distributorRoutes");
const itemRoutes = require("./routes/itemRoutes");
const customerRoutes = require("./routes/customerRoutes");
const stockRoutes = require("./routes/stockRoutes");
const promotionRoutes = require("./routes/promotionRoutes");
const saleRoutes = require("./routes/saleRoutes");
const cartRoutes = require("./routes/cartRoutes");






const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // allow JSON body

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Hardware backend is running" });
});

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/distributors", distributorRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/sales", require("./routes/saleRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cart", cartRoutes);

module.exports = app;