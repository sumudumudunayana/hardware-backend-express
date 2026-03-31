const express = require("express");
const router = express.Router();

const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require("../controllers/customerController");

const { protect } = require("../middleware/authMiddleware");

// Protect ALL routes
router.use(protect);

//  GET all customers
router.get("/", getCustomers);

//  GET single customer
router.get("/:id", getCustomerById);

//  CREATE customer
router.post("/", createCustomer);

//  UPDATE customer
router.put("/:id", updateCustomer);

//  DELETE customer
router.delete("/:id", deleteCustomer);

module.exports = router;