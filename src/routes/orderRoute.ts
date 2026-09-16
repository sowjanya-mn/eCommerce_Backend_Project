import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "#controllers";

import { validateBody } from "#middlewares";
import { orderInputSchema } from "#schemas";

export const orderRouter = Router();

orderRouter
  .route("/")
  .post(validateBody(orderInputSchema), createOrder)
  .get(getAllOrders);
orderRouter
  .route("/:id")
  .get(getOrderById)
  .put(validateBody(orderInputSchema), updateOrder)
  .delete(deleteOrder);

export default orderRouter;
