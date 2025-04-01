import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController";

const router = express.Router();

router.post("/orders", createOrder);

router.get("/orders/user/:userId", getUserOrders);

router.get("/orders/:id", getOrderById);

router.put("/orders/:id/status", updateOrderStatus);

export default router;
