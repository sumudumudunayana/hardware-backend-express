const Distributor = require("../models/distributor");

// GET ALL
const getDistributors = async (req, res) => {
  try {
    const distributors = await Distributor.find().sort({
      createdAt: -1,
    });
    res.status(200).json(distributors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET ONE
const getDistributorById = async (req, res) => {
  try {
    const distributor = await Distributor.findById(req.params.id);
    if (!distributor) {
      return res.status(404).json({
        message: "Distributor not found",
      });
    }
    res.status(200).json(distributor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE
const createDistributor = async (req, res) => {
  try {
    let {
      distributorName,
      distributorDescription,
      distributorContactNumber,
      distributorEmail,
    } = req.body;

    // clean input
    distributorName = distributorName?.trim();

    distributorDescription = distributorDescription?.trim();

    distributorEmail = distributorEmail?.trim().toLowerCase();

    // required validation
    if (
      !distributorName ||
      !distributorDescription ||
      !distributorContactNumber ||
      !distributorEmail
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // name validation
    if (!/^[A-Za-z\s]+$/.test(distributorName)) {
      return res.status(400).json({
        message: "Supplier name can contain only letters and spaces",
      });
    }

    if (distributorName.length < 2) {
      return res.status(400).json({
        message: "Supplier name must be at least 2 characters",
      });
    }

    // phone validation
    if (!/^\d{10}$/.test(distributorContactNumber)) {
      return res.status(400).json({
        message: "Contact number must be exactly 10 digits",
      });
    }

    // email validation
    if (!/^\S+@\S+\.\S+$/.test(distributorEmail)) {
      return res.status(400).json({
        message: "Invalid email address",
      });
    }

    // duplicate check
    const existingDistributor = await Distributor.findOne({
      $or: [
        {
          distributorName,
        },
        {
          distributorContactNumber,
        },
        {
          distributorEmail,
        },
      ],
    });

    if (existingDistributor) {
      return res.status(400).json({
        message:
          "Supplier with same name, phone number, or email already exists",
      });
    }

    const newDistributor = await Distributor.create({
      distributorName,
      distributorDescription,
      distributorContactNumber,
      distributorEmail,
    });

    res.status(201).json(newDistributor);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// UPDATE
const updateDistributor = async (req, res) => {
  try {
    let {
      distributorName,
      distributorDescription,
      distributorContactNumber,
      distributorEmail,
    } = req.body;

    distributorName = distributorName?.trim();

    distributorDescription = distributorDescription?.trim();

    distributorEmail = distributorEmail?.trim().toLowerCase();

    // validation
    if (
      !distributorName ||
      !distributorDescription ||
      !distributorContactNumber ||
      !distributorEmail
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!/^[A-Za-z\s]+$/.test(distributorName)) {
      return res.status(400).json({
        message: "Supplier name can contain only letters and spaces",
      });
    }

    // duplicate check excluding current distributor
    const existingDistributor = await Distributor.findOne({
      _id: {
        $ne: req.params.id,
      },
      $or: [
        {
          distributorName,
        },
        {
          distributorContactNumber,
        },
        {
          distributorEmail,
        },
      ],
    });

    if (existingDistributor) {
      return res.status(400).json({
        message: "Another supplier with same details already exists",
      });
    }

    const updatedDistributor = await Distributor.findByIdAndUpdate(
      req.params.id,
      {
        distributorName,
        distributorDescription,
        distributorContactNumber,
        distributorEmail,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedDistributor) {
      return res.status(404).json({
        message: "Distributor not found",
      });
    }

    res.status(200).json(updatedDistributor);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// DELETE
const deleteDistributor = async (req, res) => {
  try {
    const deletedDistributor = await Distributor.findByIdAndDelete(
      req.params.id,
    );

    if (!deletedDistributor) {
      return res.status(404).json({
        message: "Distributor not found",
      });
    }

    res.status(200).json({
      message: "Distributor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDistributors,
  getDistributorById,
  createDistributor,
  updateDistributor,
  deleteDistributor,
};
