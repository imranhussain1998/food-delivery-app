import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect("mongodb+srv://imranhussain72172:12345@cluster0.k87vgh2.mongodb.net/food-del").then(()=> console.log("DB Connected"))
};

