const Item = require("../models/item");
const Stock = require("../models/stock");


// GET ALL ITEMS
const getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ONE ITEM
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.status(200).json(item);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE ITEM
const createItem = async (req, res) => {
  try {
    let {
      itemName,
      itemDescription,
      itemCategory,
      itemCostPrice,
      itemSellingPrice,
      itemLabeledPrice,
      itemCompany,
      itemDistributor,
    } = req.body;

    // clean inputs
    itemName = itemName?.trim();
    itemDescription = itemDescription?.trim();

    // required field validation
    if (
      !itemName ||
      !itemDescription ||
      !itemCategory ||
      !itemCostPrice ||
      !itemSellingPrice ||
      !itemLabeledPrice ||
      !itemCompany ||
      !itemDistributor
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // item name validation
    if (!/^[A-Za-z0-9\s]+$/.test(itemName)) {
      return res.status(400).json({
        message:
          "Item name can contain only letters, numbers, and spaces",
      });
    }

    // item name cannot be only numbers
    if (/^\d+$/.test(itemName)) {
      return res.status(400).json({
        message: "Item name cannot contain only numbers",
      });
    }

    // duplicate check
    const existingItem = await Item.findOne({
      itemName: itemName,
    });

    if (existingItem) {
      return res.status(400).json({
        message: "Item name already exists",
      });
    }

    const cost = Number(itemCostPrice);
    const selling = Number(itemSellingPrice);
    const labeled = Number(itemLabeledPrice);

    // price validations
    if (cost < 0 || selling < 0 || labeled < 0) {
      return res.status(400).json({
        message: "Prices cannot be negative",
      });
    }

    if (selling <= cost) {
      return res.status(400).json({
        message:
          "Selling price must be greater than cost price",
      });
    }

    if (labeled <= selling || labeled <= cost) {
      return res.status(400).json({
        message:
          "Labeled price must be greater than selling and cost price",
      });
    }

    const newItem = await Item.create({
      itemName,
      itemDescription,
      itemCategory,
      itemCostPrice: cost,
      itemSellingPrice: selling,
      itemLabeledPrice: labeled,
      itemCompany,
      itemDistributor,
    });

    // auto create stock
    await Stock.create({
      itemId: newItem._id,
      quantity: 0,
    });

    res.status(201).json({
      message: "Item created successfully with stock record",
      item: newItem,
    });

  } catch (error) {
    console.error("CREATE ITEM ERROR:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

// UPDATE ITEM
const updateItem = async (req, res) => {
  try {
    let {
      itemName,
      itemDescription,
      itemCategory,
      itemCostPrice,
      itemSellingPrice,
      itemLabeledPrice,
      itemCompany,
      itemDistributor,
    } = req.body;

    itemName = itemName?.trim();
    itemDescription = itemDescription?.trim();

    // duplicate check excluding current item
    const existingItem = await Item.findOne({
      _id: { $ne: req.params.id },
      itemName: itemName,
    });

    if (existingItem) {
      return res.status(400).json({
        message: "Another item with same name already exists",
      });
    }

    const cost = Number(itemCostPrice);
    const selling = Number(itemSellingPrice);
    const labeled = Number(itemLabeledPrice);

    // price validations
    if (selling <= cost) {
      return res.status(400).json({
        message:
          "Selling price must be greater than cost price",
      });
    }

    if (labeled <= selling || labeled <= cost) {
      return res.status(400).json({
        message:
          "Labeled price must be greater than selling and cost price",
      });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        itemName,
        itemDescription,
        itemCategory,
        itemCostPrice: cost,
        itemSellingPrice: selling,
        itemLabeledPrice: labeled,
        itemCompany,
        itemDistributor,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedItem) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.status(200).json(updatedItem);

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// DELETE ITEM
const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    const deletedItem =
      await Item.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    await Stock.deleteOne({
      itemId: itemId,
    });

    res.status(200).json({
      message:
        "Item and related stock deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};