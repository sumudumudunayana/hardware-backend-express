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


module.exports = {
  getDistributors,
  getDistributorById,
  createDistributor,
  updateDistributor,
  deleteDistributor
};