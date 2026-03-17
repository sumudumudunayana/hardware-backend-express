const Sale = require("../models/sale");
const SaleItem = require("../models/saleItem");
const Stock = require("../models/stock");
const Promotion = require("../models/promotion");

function generateInvoiceNumber() {
  return "INV-" + Date.now();
}

//CREATE SALE
const createSale = async (req, res) => {
  try {
    const { items } = req.body; // [{ itemId, quantity, price }]
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    // 1) Stock check + subtotal
    let subtotal = 0;
    for (const cartItem of items) {
      if (!cartItem.itemId || Number(cartItem.quantity) <= 0) {
        return res.status(400).json({ message: "Invalid cart data" });
      }
      const stock = await Stock.findOne({ itemId: cartItem.itemId });
      if (!stock || stock.quantity < cartItem.quantity) {
        return res.status(400).json({
          message: `Not enough stock for itemId ${cartItem.itemId}`,
        });
      }
      subtotal += Number(cartItem.price) * Number(cartItem.quantity);
    }

    // 2) Load active promotions (date + status)
    const now = new Date();
    const promos = await Promotion.find({
      status: "active",
      startDate: { $lte: now },
      endDate: { $gte: now },
    });
    // Separate promotions
    const percentagePromos = promos.filter(
      (p) => p.discountType === "percentage",
    );
    const fixedPromos = promos.filter((p) => p.discountType === "fixed");
    // 3) Calculate discounts
    // Rule: percentage discounts first (on subtotal)
    let discountTotal = 0;
    let runningBase = subtotal;

    const appliedPromos = [];

    for (const p of percentagePromos) {
      // applyTo = all OR specific item exists in cart
      const eligible =
        p.applyTo === "all" ||
        (p.applyTo === "specific" &&
          items.some((it) => String(it.itemId) === String(p.itemId)));
      if (!eligible) continue;
      const amount = (runningBase * Number(p.discountValue)) / 100;
      if (amount <= 0) continue;

      discountTotal += amount;
      runningBase -= amount;

      appliedPromos.push({
        promotionId: p._id,
        name: p.promotionName,
        discountType: "percentage",
        discountValue: p.discountValue,
        amount: Math.round(amount * 100) / 100,
      });
    }
    // Rule: fixed discounts after percentage (ONCE per bill)
    for (const p of fixedPromos) {
      const eligible =
        p.applyTo === "all" ||
        (p.applyTo === "specific" &&
          items.some((it) => String(it.itemId) === String(p.itemId)));
      if (!eligible) continue;
      let amount = Number(p.discountValue);
      if (amount <= 0) continue;
      // do not exceed remaining base
      if (amount > runningBase) amount = runningBase;

      discountTotal += amount;
      runningBase -= amount;

      appliedPromos.push({
        promotionId: p._id,
        name: p.promotionName,
        discountType: "fixed",
        discountValue: p.discountValue,
        amount: Math.round(amount * 100) / 100,
      });
    }

    const finalTotal = Math.max(0, subtotal - discountTotal);

    // 4) Create sale
    const invoiceNumber = generateInvoiceNumber();
    const sale = await Sale.create({
      invoiceNumber,
      subtotal: Math.round(subtotal * 100) / 100,
      discountTotal: Math.round(discountTotal * 100) / 100,
      finalTotal: Math.round(finalTotal * 100) / 100,
      totalAmount: finalTotal,
      promotions: appliedPromos,
    });
    // 5) Create sale items + deduct stock
    for (const cartItem of items) {
      await SaleItem.create({
        saleId: sale._id,
        itemId: cartItem.itemId,
        quantity: Number(cartItem.quantity),
        unitPrice: Number(cartItem.price),
        subtotal: Number(cartItem.price) * Number(cartItem.quantity),
      });
      await Stock.findOneAndUpdate(
        { itemId: cartItem.itemId },
        { $inc: { quantity: -Number(cartItem.quantity) } },
      );
    }
    return res.status(201).json({
      message: "Sale completed",
      invoiceNumber,
      saleId: sale._id,
    });
  } catch (error) {
    console.error("SALE ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// GET ALL SALES  (for ManageSalesPage)
const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    const salesWithItems = await Promise.all(
      sales.map(async (sale) => {
        const items = await SaleItem.find({ saleId: sale._id }).populate(
          "itemId",
        );
        return {
          ...sale.toObject(),
          items,
        };
      }),
    );
    return res.status(200).json(salesWithItems);
  } catch (error) {
    console.error("GET ALL SALES ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

//GET SALE BY ID (Invoice Page)
const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    const saleItems = await SaleItem.find({ saleId: sale._id }).populate(
      "itemId",
    );
    return res.status(200).json({
      ...sale.toObject(),
      items: saleItems,
    });
  } catch (error) {
    console.error("GET SALE ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

//UPDATE SALE (Only totalAmount)
const updateSale = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    const sale = await Sale.findByIdAndUpdate(
      req.params.id,
      { totalAmount },
      { new: true },
    );

    if (!sale) return res.status(404).json({ message: "Sale not found" });

    return res.status(200).json(sale);
  } catch (error) {
    console.error("UPDATE SALE ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

//DELETE SALE (Restore Stock)
const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });

    const saleItems = await SaleItem.find({ saleId: sale._id });

    // Restore stock
    for (const item of saleItems) {
      await Stock.findOneAndUpdate(
        { itemId: item.itemId },
        { $inc: { quantity: item.quantity } },
      );
    }

    // Delete sale items
    await SaleItem.deleteMany({ saleId: sale._id });

    // Delete sale
    await Sale.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    console.error("DELETE SALE ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
};
