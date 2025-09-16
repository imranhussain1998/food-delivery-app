import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import foodRouter from "./routes/foodRoute.js";
import cartRouter from "./routes/cartRoute.js";
import userRouter from "./routes/userRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { connectDB } from "./config/db.js";
import path from "path";
dotenv.config();
const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// connect db
connectDB();

// serve uploaded images as static
app.use("/images", express.static(path.join("uploads")));
// routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
// test route
app.get("/", (req, res) => {
  res.send("API Working ✅");
});

app.listen(port, () => {
  console.log(`🚀 Server Started on http://localhost:${port}`);
});

//mongodb+srv://imranhussain03:Imran@1998@cluster0.fksppxy.mongodb.net/?