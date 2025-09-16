import express from "express";
import { placeOrder } from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";
import { verifyOrder , userOrders, listOrders, updateStatus} from "../controllers/orderController.js";



const orderRouter = express.Router();
orderRouter.post("/place",authMiddleware, placeOrder)
orderRouter.post("/verify",authMiddleware, verifyOrder)
orderRouter.get("/userorders",authMiddleware, userOrders)
orderRouter.get("/list", listOrders)
orderRouter.post("/status", updateStatus)

export default orderRouter;