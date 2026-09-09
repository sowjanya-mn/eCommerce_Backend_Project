import type { RequestHandler } from "express";
import { Order } from "#models";
import type { OrderType } from "#types";
import e from "express";

export const getAllOrders: RequestHandler = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId")
      .populate("products.productId");
    res.json(orders);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error fetching orders", error });
    }
  }
};

export const createOrder: RequestHandler = async (req, res) => {
  try {
    const { userId, products, total } = req.body as OrderType;
    const order = await Order.create({
      userId,
      products,
      total,
    } satisfies OrderType);
    res.status(201).json(order);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error creating order", error });
    }
  }
};
export const getOrderById: RequestHandler = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const order = await Order.findById(id)
      .populate("userId")
      .populate("products.productId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error fetching order", error });
    }
  }
};

export const updateOrder: RequestHandler = async (req, res) => {
  try {
    const {
      params: { id },
      body,
    } = req;
    const order = await Order.findByIdAndUpdate(id, body, { new: true })
      .populate("userId")
      .populate("products.productId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error updating order", error });
    }
  }
};
