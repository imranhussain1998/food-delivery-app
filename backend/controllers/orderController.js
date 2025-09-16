import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Place new order
const placeOrder = async (req, res) => {
  const frontendURL = "http://localhost:5173";
  const { items, amount, address, email } = req.body;

  try {
    // Save order in DB
    const newOrder = new orderModel({
      userId: req.user.userId, // ✅ from auth middleware
      items,
      amount,
      address,
    });

    await newOrder.save();

    // Clear user cart
    await userModel.findByIdAndUpdate(req.user.userId, { cartData: {} });

    // Stripe line items
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100 *80,
      },
      quantity: item.quantity,
    }));

    // Add shipping
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Shipping Charges",
          description: "Delivery Charges",
        },
        unit_amount: 2 * 100 * 80, 
      },
      quantity: 1,
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontendURL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontendURL}/verify?success=false&orderId=${newOrder._id}`,
      customer_email: email,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error in placeOrder:", error);
    res.json({ success: false, message: "Something went wrong: " + error });
  }
};

// ✅ Verify order
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        status: "Confirmed",
      });
      res.json({ success: true, message: "Order confirmed ✅" });
    } else {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: false,
        status: "Cancelled",
      });
      res.json({ success: false, message: "Order cancelled ❌" });
    }
  } catch (error) {
    console.error("Error in verifyOrder:", error);
    res.status(500).json({ success: false, message: "Server error ❌" });
  }
};

// ✅ Get logged-in user's orders
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error in userOrders:", error);
    res.status(500).json({ success: false, message: "Server error ❌" });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const updateStatus = async (req, res) => {
  const { orderId, status } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({ success: false, message: "Order ID and status are required" });
  }

  try {
    // Find order and update its status
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // return updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      message: "Order status updated successfully ✅",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error in updateStatus:", error);
    res.status(500).json({ success: false, message: "Failed to update order status ❌" });
  }
};


export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
