import { OrderStatus } from "../enums/enums";
import { OrderModel } from "../models/order";

export const createOrder = async (req: any, res: any) => {
  try {
    const { userId, products, totalAmount } = req.body;

    if (!userId || !products || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newOrder = new OrderModel({
      user: userId,
      products,
      totalAmount,
      status: OrderStatus.PENDING,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserOrders = async (req: any, res: any) => {
  try {
    const userId = req.params.userId;
    const orders = await OrderModel.find({ user: userId }).populate(
      "products.product"
    );
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req: any, res: any) => {
  try {
    const orderId = req.params.id;
    const order = await OrderModel.findById(orderId).populate(
      "products.product"
    );
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req: any, res: any) => {
  try {
    const { orderId, status } = req.body;

    if (!Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({ message: "Invalid order status." });
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("products.product");

    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found." });
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
