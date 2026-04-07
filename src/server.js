require("dotenv").config();

const cron = require("node-cron");
const app = require("./app");
const connectDB = require("./config/db");
const Promotion = require("./models/promotion");

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  /* AUTO DEACTIVATE EXPIRED PROMOTIONS */
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      await Promotion.updateMany(
        {
          startDate: { $lte: now },
          endDate: { $gte: now },
        },
        {
          $set: { status: "active" },
        },
      );

      await Promotion.updateMany(
        {
          endDate: { $lt: now },
        },
        {
          $set: { status: "inactive" },
        },
      );

      console.log("Promotion statuses updated");
    } catch (error) {
      console.error(error.message);
    }
  });

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();
