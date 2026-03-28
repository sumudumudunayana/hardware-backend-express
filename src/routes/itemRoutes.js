const express = require("express");
const router = express.Router();

const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require("../controllers/itemController");

const { protect } = require("../middleware/authMiddleware");

//  Protect ALL routes (only logged-in users)
router.use(protect);

//  GET all items
router.get("/", getItems);

//  GET single item
router.get("/:id", getItemById);

//  CREATE item
router.post("/", createItem);

//  UPDATE item
router.put("/:id", updateItem);

//  DELETE item
router.delete("/:id", deleteItem);

module.exports = router;