const express = require("express");
const router = express.Router();

const {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
} = require("../controllers/companyController");

const { protect } = require("../middleware/authMiddleware");

//  Protect ALL routes
router.use(protect);

//  GET all companies
router.get("/", getCompanies);

//  GET single company
router.get("/:id", getCompanyById);

//  CREATE company
router.post("/", createCompany);

//  UPDATE company
router.put("/:id", updateCompany);

//  DELETE company
router.delete("/:id", deleteCompany);

module.exports = router;