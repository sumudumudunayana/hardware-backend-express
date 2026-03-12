const Cart = require("../models/cart");

// GET CART
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD ITEM TO CART
const addToCart = async (req, res) => {
  try {
    const { itemId, name, price } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        items: [],
      });
    }
    const existingItem = cart.items.find(
      (item) => item.itemId.toString() === itemId,
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        itemId,
        name,
        price,
        quantity: 1,
      });
    }
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE QTY
const updateQty = async (req, res) => {
  const { itemId, quantity } = req.body;
  const cart = await Cart.findOne({ userId: req.user.id });
  const item = cart.items.find((i) => i.itemId.toString() === itemId);

  if (item) item.quantity = quantity;

  await cart.save();

  res.json(cart);
};

// CLEAR CART
const clearCart = async (req, res) => {
  await Cart.findOneAndDelete({ userId: req.user.id });

  res.json({ message: "Cart cleared" });
};

// REMOVE ITEM
const removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.itemId.toString() !== itemId);

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateQty,
  clearCart,
  removeItem

};
