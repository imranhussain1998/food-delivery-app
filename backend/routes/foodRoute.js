import express from "express";
import multer from "multer";
import {addFood, listFoods, removeFood} from "../controllers/foodController.js";
import path from "path";

const foodRouter = express.Router();

// multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure uploads folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage: storage });


// route
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFoods);
foodRouter.post("/remove", removeFood)

export default foodRouter;
