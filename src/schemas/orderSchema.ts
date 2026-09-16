import { z } from "zod";
import { Types } from "mongoose";

/**
 * @openapi
 * components:
 *   schemas:
 *     OrderInput:
 *       type: object
 *       required:
 *         - userId
 *         - products
 *         - total
 *       properties:
 *         userId:
 *           type: string
 *           minLength: 1
 *           description: The ID of the user placing the order.
 *         products:
 *           type: array
 *           minItems: 1
 *           description: Must contain at least one product.
 *           items:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 minLength: 1
 *                 description: The unique identifier of the product.
 *               quantity:
 *                 type: number
 *                 minimum: 0
 *                 exclusiveMinimum: true
 *                 default: 1
 *                 description: The quantity of this product. Defaults to 1 if not specified.
 *         total:
 *           type: number
 *           minimum: 0
 */

export const orderInputSchema = z.strictObject({
  userId: z.string().trim().min(1, { message: "User ID is required" }),

  products: z
    .array(
      z.strictObject({
        productId: z.string().trim().min(1, { message: "User ID is required" }),

        quantity: z
          .number()
          .gt(0, { message: "Quantity must be at least 1" })
          .default(1),
      }),
    )
    .min(1, { message: "An order must contain at least one product" }),

  total: z.number(),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     OrderOutput:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: ObjectId
 *         userId:
 *           type: string
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *         total:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 */

export const orderOutputSchema = orderInputSchema.extend({
  _id: z.instanceof(Types.ObjectId),
  ...orderInputSchema.shape,
  createdAt: z.date(),
});
