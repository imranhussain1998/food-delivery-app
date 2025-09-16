import userModel from "../models/userModel.js";

// ✅ Add item to cart
const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.user.userId);
    let cartData = userData.cartData;

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.user.userId, { cartData });
    res.json({
      success: true,
      message: "Item added to cart ✅",
      data: cartData,
    });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ success: false, message: "Server error ❌" });
  }
};

// ✅ Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.user.userId);
    let cartData = userData.cartData;

    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
      if (cartData[req.body.itemId] === 0) {
        delete cartData[req.body.itemId]; // optional: cleanup
      }
    }

    await userModel.findByIdAndUpdate(req.user.userId, { cartData });
    res.json({
      success: true,
      message: "Item removed from cart ✅",
      data: cartData,
    });
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    res.status(500).json({ success: false, message: "Server error ❌" });
  }
};

// ✅ Get cart
const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.user.userId);
    console.log(userData)
    res.json({
      success: true,
      cartItemData: userData.cartData,
    });
  } catch (error) {
    console.error("Error in getCart:", error);
    res.status(500).json({ success: false, message: "Server error ❌" });
  }
};

export { addToCart, removeFromCart, getCart };
