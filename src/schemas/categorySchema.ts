import { z } from "zod";
import { Types } from "mongoose";

/**
 * @openapi
 * components:
 *   schemas:
 *     CategoryInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           description: Name of the category. Cannot be empty.
 */

export const categoryInputSchema = z.strictObject({
  name: z.string().trim().min(1, { message: "Category name is required" }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     CategoryOutput:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: ObjectId
 *         name:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

export const categoryOutputSchema = categoryInputSchema.extend({
  _id: z.instanceof(Types.ObjectId),
  ...categoryInputSchema.shape,
  createdAt: z.date(),
});
