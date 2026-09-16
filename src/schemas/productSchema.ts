import { z } from "zod";
import { Types } from "mongoose";

/**
 * @openapi
 * components:
 *   schemas:
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - categoryId
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           description: The name of the product. Cannot be empty.
 *         description:
 *           type: string
 *           minLength: 1
 *           description: The description of the product. Cannot be empty.
 *         price:
 *           type: number
 *           minimum: 0
 *           exclusiveMinimum: true
 *           description: The price of the product. Must be greater than zero.
 *         categoryId:
 *           type: string
 *           minLength: 1
 *           description: Category ID cannot be empty.
 */

export const productInputSchema = z.strictObject({
  name: z.string().trim().min(1, { message: "Name is required" }),
  description: z.string().trim().min(1, { message: "Description is required" }),
  price: z.number().gt(0, { message: "Price should be greater than zero." }),
  categoryId: z.string().trim().min(1, { message: "Category ID is required" }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     ProductOutput:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: ObjectId
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         categoryId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

export const productOutputSchema = productInputSchema.extend({
  _id: z.instanceof(Types.ObjectId),
  ...productInputSchema.shape,
  createdAt: z.date(),
});
