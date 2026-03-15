const Distributor = require("../models/distributor");

// GET ALL
const getDistributors = async (req, res) => {
  try {
    const distributors = await Distributor.find().sort({ createdAt: -1 });
    res.status(200).json(distributors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE
const getDistributorById = async (req, res) => {
  try {
    const distributor = await Distributor.findById(req.params.id);
    if (!distributor) {
      return res.status(404).json({ message: "Distributor not found" });
    }

    res.status(200).json(distributor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
const createDistributor = async (req, res) => {
  try {
    const newDistributor = await Distributor.create(req.body);
    res.status(201).json(newDistributor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE
const updateDistributor = async (req, res) => {
  try {
    const updatedDistributor = await Distributor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedDistributor) {
      return res.status(404).json({ message: "Distributor not found" });
    }

    res.status(200).json(updatedDistributor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
const deleteDistributor = async (req, res) => {
  try {
    const deletedDistributor = await Distributor.findByIdAndDelete(req.params.id);

    if (!deletedDistributor) {
      return res.status(404).json({ message: "Distributor not found" });
    }

    res.status(200).json({ message: "Distributor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getDistributors,
  getDistributorById,
  createDistributor,
  updateDistributor,
  deleteDistributor
};