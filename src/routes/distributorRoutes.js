const express = require("express");
const router = express.Router();

const {
  getDistributors,
  getDistributorById,
  createDistributor,
  updateDistributor,
  deleteDistributor
} = require("../controllers/distributorController");

const { protect } = require("../middleware/authMiddleware");

// Protect ALL routes
router.use(protect);

//  GET all distributors
router.get("/", getDistributors);

//  GET single distributor
router.get("/:id", getDistributorById);

//  CREATE distributor
router.post("/", createDistributor);

//  UPDATE distributor
router.put("/:id", updateDistributor);

//  DELETE distributor
router.delete("/:id", deleteDistributor);

module.exports = router;