const axios = require("axios");

/*
Using:
1. SaleItem -> latest sold product
2. Item (populate itemId) -> product details
3. Stock -> real available stock quantity
*/

const SaleItem = require("../models/saleitem");
const Stock = require("../models/stock");

const predictAI = async (req, res) => {
  try {
    const monthlyForecast = [];

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // =========================================================
    // FETCH LATEST SALE ITEM + POPULATE ITEM DETAILS
    // =========================================================

    const latestSale = await SaleItem.findOne()
      .populate("itemId")
      .sort({ createdAt: -1 });

    if (!latestSale || !latestSale.itemId) {
      return res.status(404).json({
        message: "No sales item data found for AI prediction",
      });
    }

    const itemDetails = latestSale.itemId;

    // =========================================================
    // FETCH REAL STOCK DATA
    // =========================================================

    const stockData = await Stock.findOne({
      itemId: itemDetails._id,
    });

    const currentStock = stockData?.quantity || 0;

    let finalPredictedDemand = 0;
    let finalPredictedRevenue = 0;

    // =========================================================
    // CURRENT DATE VALUES
    // =========================================================

    const today = new Date();
    const currentDay = today.getDate();
    const currentDayOfWeek = today.getDay();

    const isWeekend =
      currentDayOfWeek === 0 || currentDayOfWeek === 6 ? 1 : 0;

    // =========================================================
    // CATEGORY MAPPING
    // =========================================================

    let category = "Electrical";

    if (
      itemDetails.itemCategory &&
      itemDetails.itemCategory.toLowerCase().includes("plumb")
    ) {
      category = "Plumbing";
    }

    if (
      itemDetails.itemCategory &&
      itemDetails.itemCategory.toLowerCase().includes("oil")
    ) {
      category = "Oil";
    }

    // =========================================================
    // GENERATE 12 MONTH FORECAST
    // =========================================================

    for (let month = 1; month <= 12; month++) {
      const requestBody = {
        /*
        Temporary fixed product_id for encoder compatibility

        Later we can create real mapping like:
        itemId -> E001 / P001 / O001
        */

        product_id: "E001",

        category: category,

        unit_price:
          latestSale.unitPrice ||
          itemDetails.itemSellingPrice ||
          650,

        // Time Features
        month: month,
        day: currentDay,
        day_of_week: currentDayOfWeek,
        is_weekend: isWeekend,

        // Feature Engineering Values
        rolling_avg_qty: latestSale.quantity || 10,
        previous_qty: latestSale.quantity || 8,

        lag_1: latestSale.quantity || 8,
        lag_2: latestSale.quantity || 7,

        rolling_avg_7: latestSale.quantity || 9,
        rolling_avg_30: latestSale.quantity || 11,
      };

      // =========================================================
      // CALL FASTAPI AI SERVICE
      // =========================================================

      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        requestBody
      );

      const predictedRevenue =
        response.data.predicted_revenue || 0;

      const predictedDemand =
        response.data.predicted_demand || 0;

      // Current month main KPI
      if (month === today.getMonth() + 1) {
        finalPredictedRevenue = predictedRevenue;
        finalPredictedDemand = predictedDemand;
      }

      // Real revenue from latest sale
      const lastYearRevenue =
        latestSale.subtotal ||
        (latestSale.unitPrice || 0) *
          (latestSale.quantity || 0);

      monthlyForecast.push({
        month: monthNames[month - 1],
        lastYearRevenue,
        predictedRevenue,
      });
    }

    // =========================================================
    // FINAL CALCULATIONS
    // =========================================================

    const recommendedStock =
      Math.ceil(finalPredictedDemand + 5);

    // =========================================================
    // FINAL RESPONSE TO FRONTEND
    // =========================================================

    res.status(200).json({
      product_id: "E001",

      product_name:
        itemDetails.itemName || "Product Name",

      category: category,

      predicted_revenue: finalPredictedRevenue,
      predicted_demand: finalPredictedDemand,

      current_stock: currentStock,
      recommended_stock: recommendedStock,

      monthly_forecast: monthlyForecast,
    });
  } catch (error) {
    console.error("AI prediction error:", error.message);

    res.status(500).json({
      message: "AI prediction failed",
      error: error.message,
    });
  }
};

const retrainAI = async (req, res) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/retrain"
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("AI retrain error:", error.message);

    res.status(500).json({
      message: "AI retraining failed",
      error: error.message,
    });
  }
};

module.exports = {
  predictAI,
  retrainAI,
};