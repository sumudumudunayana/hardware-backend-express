const axios = require("axios");
const SaleItem = require("../models/saleitem");
const Stock = require("../models/stock");

// ==============================
// MULTI-PRODUCT PREDICTION
// ==============================
const predictAI = async (req, res) => {
  try {
    // Get latest sale per product
    const sales = await SaleItem.find()
      .populate("itemId")
      .sort({ createdAt: -1 });

    if (!sales || sales.length === 0) {
      return res.status(404).json({
        message: "No sales data found",
      });
    }

    const processedProducts = new Set();
    const results = [];

    for (const sale of sales) {
      const item = sale.itemId;
      if (!item) continue;

      const productId = String(item._id);

      // Avoid duplicate products
      if (processedProducts.has(productId)) continue;
      processedProducts.add(productId);

      const stock = await Stock.findOne({ itemId: item._id });

      const today = new Date();

      const requestBody = {
        product_id: productId,

        unit_price: sale.unitPrice || item.itemSellingPrice || 0,
        quantity_sold: sale.quantity || 0,

        month: today.getMonth() + 1,
        day: today.getDate(),
        day_of_week: today.getDay(),
        is_weekend: today.getDay() >= 5 ? 1 : 0,

        rolling_avg_qty: sale.quantity || 0,
        previous_qty: sale.quantity || 0,

        // 🔥 ADD THESE
        lag_1: sale.quantity || 0,
        lag_2: sale.quantity || 0,
        rolling_avg_7: sale.quantity || 0,
        rolling_avg_30: sale.quantity || 0,
      };

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/predict",
          requestBody,
        );

        results.push({
          product_id: productId,
          product_name: item.itemName,

          predicted_demand: response.data.predicted_demand,
          predicted_revenue: response.data.predicted_revenue,

          current_stock: stock?.quantity || 0,
          recommended_stock: Math.ceil(response.data.predicted_demand + 5),
        });
      } catch (err) {
        console.error(
          "AI prediction error:",
          err.response?.data || err.message,
        );
      }
    }

    // Sort by highest demand
    results.sort((a, b) => b.predicted_demand - a.predicted_demand);

    res.status(200).json(results);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Prediction failed",
      error: error.message,
    });
  }
};

// ==============================
// RETRAIN
// ==============================
const retrainAI = async (req, res) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/retrain");

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Retraining failed",
      error: error.message,
    });
  }
};

// ==============================
module.exports = {
  predictAI,
  retrainAI,
};
