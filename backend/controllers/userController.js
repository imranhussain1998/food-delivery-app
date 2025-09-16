import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET,);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if(!user){
      return res.json({ success: false, message: "Invalid email or password ❌" });
    }
    const ismatch = await bcrypt.compare(password, user.password);
    if(!ismatch){
      return res.json({ success: false, message: "Invalid email or password ❌" });
    }

    const token = generateToken(user._id);
    res.json({ success: true, message: "Login successful ✅", token });

  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ success: false, message: "Server error ❌" });
  }
};

const fullDataUser = async (req, res) => {
  try {
    const user = await userModel.find().select("-password");
    res.json({ success: true, data: user });
  } catch (error) { 
    console.error("Error in fullDataUser:", error);
    res.status(500).json({ success: false, message: "Server error ❌" });
  }
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: "User already exists ❌" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email ❌" });
    }

    if (!password || password.length < 6) {
      return res.json({ success: false, message: "Password must be at least 6 characters ❌" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const token = generateToken(user._id);

    res.json({ success: true, message: "User registered successfully ✅", token });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ success: false, message: "Server error ❌" });
  }
};

export { loginUser, registerUser, fullDataUser }; 
