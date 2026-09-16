import type { RequestHandler } from "express";
import { Order, User, Product } from "#models";
import type { OrderType } from "#types";
import e from "express";
import { orderInputSchema } from "#schemas";
import { z } from "zod";
import type { Types } from "mongoose";

type OrderInputDTO = z.infer<typeof orderInputSchema>;
type OrderOutputDTO = OrderInputDTO & {
  _id: InstanceType<typeof Types.ObjectId>;
  createdAt: Date;
  updatedAt: Date;
};
type IDParams = {
  id: string;
};

/**
 * @openapi
 * /orders:
 *   get:
 *     tags:
 *       - Orders
 *     description: Get all orders
 *     requestBody:
 *        required: false
 *
 *     responses:
 *      201:
 *        description: Orders fetched Successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrderOutput'
 *      400:
 *        description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error message"
 */

export const getAllOrders: RequestHandler<
  unknown,
  OrderOutputDTO[] | { error: string }
> = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("userId")
      .populate("products.productId")
      .lean();

    const ordersDTO: OrderOutputDTO[] = (orders as any[]).map((order) => {
      return {
        _id: order._id,
        total: order.total,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,

        userId:
          order.userId &&
          typeof order.userId === "object" &&
          "_id" in order.userId
            ? order.userId._id.toString()
            : order.userId?.toString() || "",

        products: (order.products || []).map((item: any) => ({
          quantity: item.quantity,
          productId:
            item.productId &&
            typeof item.productId === "object" &&
            "_id" in item.productId
              ? item.productId._id.toString()
              : item.productId?.toString() || "",
        })),
      };
    });

    return res.json(ordersDTO);
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /orders:
 *   post:
 *     tags:
 *       - Orders
 *     description: Create a new order
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrderInput'
 *     responses:
 *      201:
 *        description: Order created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrderOutput'
 *      400:
 *        description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error message"
 */

export const createOrder: RequestHandler<
  unknown,
  OrderOutputDTO | { error: string },
  OrderInputDTO
> = async (req, res, next) => {
  try {
    const { userId, products, total } = req.body;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res
        .status(404)
        .json({ error: "Invalid userId. User does not exist." });
    }

    if (!products || products.length === 0) {
      return res.status(400).json({ error: "Products list cannot be empty" });
    }
    const productIds = products.map((p) => p.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } }).lean();

    if (dbProducts.length !== products.length) {
      return res
        .status(400)
        .json({ error: "One or more products in your cart are invalid." });
    }

    const priceMap = new Map(
      dbProducts.map((p) => [p._id.toString(), p.price]),
    );

    const calculatedTotal = products.reduce((sum, item) => {
      const price = priceMap.get(item.productId.toString()) || 0;
      return sum + price * item.quantity;
    }, 0);

    const newOrderDoc = await Order.create({
      userId,
      products,
      total: calculatedTotal,
    });

    const order = newOrderDoc.toObject() as any;

    const orderDTO: OrderOutputDTO = {
      _id: order._id,
      total: order.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      userId: order.userId.toString(),
      products: order.products.map((item: any) => ({
        quantity: item.quantity,
        productId: item.productId ? item.productId.toString() : "",
      })),
    };

    return res.status(201).json(orderDTO);
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     parameters: [
 *      {
 *        in: 'path',
 *        name: 'id',
 *        required: true,
 *        schema: {
 *        type: 'string'
 *        }
 *      }
 *     ]
 *
 *     description: Get a order by id
 *     requestBody:
 *        required: false
 *
 *     responses:
 *      201:
 *        description: Order fetched Successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrderOutput'
 *      400:
 *        description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error message"
 */

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

/**
 * @openapi
 * /orders/{id}:
 *   put:
 *     tags:
 *       - Orders
 *     parameters: [
 *      {
 *        in: 'path',
 *        name: 'id',
 *        required: true,
 *        schema: {
 *        type: 'string'
 *        }
 *      }
 *     ]
 *     description: Update existing order
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrderInput'
 *     responses:
 *      201:
 *        description: Order updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrderOutput'
 *      400:
 *        description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error message"
 */

export const updateOrder: RequestHandler<
  IDParams,
  OrderOutputDTO | { error: string },
  OrderInputDTO
> = async (req, res, next) => {
  try {
    const {
      params: { id },
      body,
    } = req;

    if (body.userId) {
      const userExists = await User.findById(body.userId);
      if (!userExists) {
        return res
          .status(404)
          .json({ error: "Invalid userId. User does not exist." });
      }
    }

    if (!body.products || body.products.length === 0) {
      return res.status(400).json({ error: "Products list cannot be empty" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, body, { new: true })
      .populate("userId")
      .populate("products.productId")
      .lean();

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = updatedOrder as any;

    const orderDTO: OrderOutputDTO = {
      _id: order._id,
      total: order.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,

      userId:
        order.userId &&
        typeof order.userId === "object" &&
        "_id" in order.userId
          ? order.userId._id.toString()
          : order.userId?.toString() || "",

      products: (order.products || []).map((item: any) => ({
        quantity: item.quantity,
        productId:
          item.productId &&
          typeof item.productId === "object" &&
          "_id" in item.productId
            ? item.productId._id.toString()
            : item.productId?.toString() || "",
      })),
    };

    return res.json(orderDTO);
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /orders/{id}:
 *   delete:
 *     tags:
 *       - Orders
 *     parameters: [
 *      {
 *        in: 'path',
 *        name: 'id',
 *        required: true,
 *        schema: {
 *        type: 'string'
 *        }
 *      }
 *     ]
 *
 *     description: Delete a order by id
 *     requestBody:
 *        required: false
 *
 *     responses:
 *      201:
 *        description: Order deleted Successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrderOutput'
 *      400:
 *        description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error message"
 */

export const deleteOrder: RequestHandler<
  IDParams,
  { message: string }
> = async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;

    const order = await Order.findByIdAndDelete(id).lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({ message: "Order deleted successfully" });
  } catch (error) {
    next(error);
  }
};
