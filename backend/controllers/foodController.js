import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";

// Add food item
const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file uploaded ❌" });
    }

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.file.filename, // only filename stored
    });

    await food.save();
    res.json({ success: true, message: "Food item added successfully ✅", data: food });
  } catch (error) {
    console.error("Error in addFood:", error);
    res.status(500).json({ success: false, message: "Server error ❌" });
  }
};

// List all foods
const listFoods = async (req, res) => {
  try {
    const foods = await foodModel.find();
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("Error in listFoods:", error);
    res.status(500).json({ success: false, message: "Server error ❌" });
  }
};

// Remove food item
const removeFood = async (req, res) => {
  try {
    const { id } = req.body;
    const food = await foodModel.findById(id);

    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found ❌" });
    }

    // delete image from uploads
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Food item removed successfully ✅" });
  } catch (error) {
    console.error("Error in removeFood:", error);
    res.status(500).json({ success: false, message: "Server error ❌" });
  }
};

export { addFood, listFoods, removeFood };
