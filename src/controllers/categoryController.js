const Category = require("../models/category");

// GET ALL CATEGORIES
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({
      createdAt: -1,
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE CATEGORY
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(
      req.params.id
    );
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE CATEGORY
const createCategory = async (req, res) => {
  try {
    let {
      categoryName,
      categoryDescription,
    } = req.body;
    // clean input
    categoryName =
      categoryName?.trim();
    categoryDescription =
      categoryDescription?.trim();
    // required validation
    if (
      !categoryName ||
      !categoryDescription
    ) {
      return res.status(400).json({
        message:
          "All fields are required",
      });
    }
    // name validation
    if (
      !/^[A-Za-z\s]+$/.test(
        categoryName
      )
    ) {
      return res.status(400).json({
        message:
          "Category name can contain only letters and spaces",
      });
    }
    if (categoryName.length < 3) {
      return res.status(400).json({
        message:
          "Category name must be at least 3 characters",
      });
    }
    // duplicate check
    const existingCategory =
      await Category.findOne({
        categoryName,
      });
    if (existingCategory) {
      return res.status(400).json({
        message:
          "Category name already exists",
      });
    }

    const newCategory =
      await Category.create({
        categoryName,
        categoryDescription,
      });

    res.status(201).json(
      newCategory
    );

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
  try {
    let {
      categoryName,
      categoryDescription,
    } = req.body;

    categoryName =
      categoryName?.trim();
    categoryDescription =
      categoryDescription?.trim();

    // validation
    if (
      !categoryName ||
      !categoryDescription
    ) {
      return res.status(400).json({
        message:
          "All fields are required",
      });
    }

    if (
      !/^[A-Za-z\s]+$/.test(
        categoryName
      )
    ) {
      return res.status(400).json({
        message:
          "Category name can contain only letters and spaces",
      });
    }

    // duplicate check excluding current category
    const existingCategory =
      await Category.findOne({
        _id: {
          $ne: req.params.id,
        },
        categoryName,
      });

    if (existingCategory) {
      return res.status(400).json({
        message:
          "Another category with same name already exists",
      });
    }

    const updatedCategory =
      await Category.findByIdAndUpdate(
        req.params.id,
        {
          categoryName,
          categoryDescription,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json(
      updatedCategory
    );

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
  try {
    const deletedCategory =
      await Category.findByIdAndDelete(
        req.params.id
      );

    if (!deletedCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message:
        "Category deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};