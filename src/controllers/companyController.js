const Company = require("../models/company");

// GET ALL
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({
      createdAt: -1,
    });
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ONE
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE
const createCompany = async (req, res) => {
  try {
    let {
      companyName,
      companyDescription,
      companyAddress,
      companyContactNumber,
      companyEmail,
    } = req.body;
    // clean input
    companyName = companyName?.trim();
    companyDescription = companyDescription?.trim();
    companyAddress = companyAddress?.trim();
    companyEmail = companyEmail?.trim().toLowerCase();
    // required validation
    if (
      !companyName ||
      !companyDescription ||
      !companyAddress ||
      !companyContactNumber ||
      !companyEmail
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // company name validation
    if (!/^[A-Za-z\s]+$/.test(companyName)) {
      return res.status(400).json({
        message: "Company name can contain only letters and spaces",
      });
    }

    if (companyName.length < 3) {
      return res.status(400).json({
        message: "Company name must be at least 3 characters",
      });
    }

    // address validation
    if (!/^[A-Za-z0-9\s,./-]+$/.test(companyAddress)) {
      return res.status(400).json({
        message: "Address contains invalid symbols",
      });
    }

    // phone validation
    if (!/^\d{10}$/.test(companyContactNumber)) {
      return res.status(400).json({
        message: "Contact number must be exactly 10 digits",
      });
    }

    // email validation
    if (!/^\S+@\S+\.\S+$/.test(companyEmail)) {
      return res.status(400).json({
        message: "Invalid email address",
      });
    }

    // duplicate check
    const existingCompany = await Company.findOne({
      $or: [
        {
          companyName,
        },
        {
          companyAddress,
        },
        {
          companyContactNumber,
        },
        {
          companyEmail,
        },
      ],
    });

    if (existingCompany) {
      return res.status(400).json({
        message:
          "Company with same name, address, phone, or email already exists",
      });
    }

    const newCompany = await Company.create({
      companyName,
      companyDescription,
      companyAddress,
      companyContactNumber,
      companyEmail,
    });

    res.status(201).json(newCompany);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// UPDATE
const updateCompany = async (req, res) => {
  try {
    let {
      companyName,
      companyDescription,
      companyAddress,
      companyContactNumber,
      companyEmail,
    } = req.body;

    companyName = companyName?.trim();

    companyDescription = companyDescription?.trim();

    companyAddress = companyAddress?.trim();

    companyEmail = companyEmail?.trim().toLowerCase();

    // validation
    if (
      !companyName ||
      !companyDescription ||
      !companyAddress ||
      !companyContactNumber ||
      !companyEmail
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!/^[A-Za-z\s]+$/.test(companyName)) {
      return res.status(400).json({
        message: "Company name can contain only letters and spaces",
      });
    }

    if (!/^[A-Za-z0-9\s,./-]+$/.test(companyAddress)) {
      return res.status(400).json({
        message: "Address contains invalid symbols",
      });
    }

    // duplicate check excluding current company
    const existingCompany = await Company.findOne({
      _id: {
        $ne: req.params.id,
      },
      $or: [
        {
          companyName,
        },
        {
          companyAddress,
        },
        {
          companyContactNumber,
        },
        {
          companyEmail,
        },
      ],
    });

    if (existingCompany) {
      return res.status(400).json({
        message: "Another company with same details already exists",
      });
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      {
        companyName,
        companyDescription,
        companyAddress,
        companyContactNumber,
        companyEmail,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedCompany) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.status(200).json(updatedCompany);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// DELETE
const deleteCompany = async (req, res) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);

    if (!deletedCompany) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.status(200).json({
      message: "Company deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
};
