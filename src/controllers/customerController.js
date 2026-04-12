const Customer = require("../models/customer");

// GET ALL
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ONE
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// CREATE
const createCustomer = async (req, res) => {
  try {
    let {
      customerName,
      customerContactNumber,
      customerEmail,
    } = req.body;
    // Clean input
    customerName = customerName?.trim();
    customerEmail = customerEmail?.trim().toLowerCase();
    // Validation
    if (!customerName || !customerContactNumber || !customerEmail) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    // Name validation
    if (!/^[A-Za-z\s]+$/.test(customerName)) {
      return res.status(400).json({
        message:
          "Customer name can contain only letters and spaces",
      });
    }
    // Phone validation
    if (!/^\d{10}$/.test(customerContactNumber)) {
      return res.status(400).json({
        message: "Contact number must be exactly 10 digits",
      });
    }

    // Email validation
    if (!/^\S+@\S+\.\S+$/.test(customerEmail)) {
      return res.status(400).json({
        message: "Invalid email address",
      });
    }

    // Duplicate check
    const existingCustomer = await Customer.findOne({
      $or: [
        { customerName: customerName },
        { customerContactNumber: customerContactNumber },
        { customerEmail: customerEmail },
      ],
    });

    if (existingCustomer) {
      return res.status(400).json({
        message:
          "Customer with same name, phone number, or email already exists",
      });
    }

    const newCustomer = await Customer.create({
      customerName,
      customerContactNumber,
      customerEmail,
    });

    res.status(201).json(newCustomer);

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// UPDATE
const updateCustomer = async (req, res) => {
  try {
    let {
      customerName,
      customerContactNumber,
      customerEmail,
    } = req.body;

    if (customerName) customerName = customerName.trim();
    if (customerEmail)
      customerEmail = customerEmail.trim().toLowerCase();

    // Duplicate check excluding current customer
    const existingCustomer = await Customer.findOne({
      _id: { $ne: req.params.id },
      $or: [
        { customerName },
        { customerContactNumber },
        { customerEmail },
      ],
    });

    if (existingCustomer) {
      return res.status(400).json({
        message:
          "Another customer with same details already exists",
      });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        customerName,
        customerContactNumber,
        customerEmail,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCustomer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json(updatedCustomer);

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// DELETE
const deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer =
      await Customer.findByIdAndDelete(req.params.id);

    if (!deletedCustomer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json({
      message: "Customer deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};