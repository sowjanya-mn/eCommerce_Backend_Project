import type { RequestHandler } from "express";
import { Category } from "#models";
import type { CategoryType } from "#types";

import { categoryInputSchema } from "#schemas";
import { z } from "zod";
import type { Types } from "mongoose";

type CategoryInputDTO = z.infer<typeof categoryInputSchema>;
type CategoryOutputDTO = CategoryInputDTO & {
  _id: InstanceType<typeof Types.ObjectId>;
  createdAt: Date;
  updatedAt: Date;
};
type IDParams = {
  id: string;
};

/**
 * @openapi
 * /categories:
 *   get:
 *     tags:
 *       - Categories
 *     description: Get all categories
 *     requestBody:
 *        required: false
 *
 *     responses:
 *      201:
 *        description: Categories fetched Successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CategoryOutput'
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

export const getCategories: RequestHandler<
  unknown,
  CategoryOutputDTO[] | { error: string }
> = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories as CategoryOutputDTO[]);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

/**
 * @openapi
 * /categories:
 *   post:
 *     tags:
 *       - Categories
 *     description: Create a new category
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *      201:
 *        description: category created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CategoryOutput'
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

export const createCategory: RequestHandler<
  unknown,
  CategoryOutputDTO | { message: string },
  CategoryInputDTO
> = async (req, res) => {
  try {
    const { name } = req.body as CategoryInputDTO;
    const category = await Category.create({ name } satisfies CategoryType);
    res.status(201).json(category as CategoryOutputDTO);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     tags:
 *       - Categories
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
 *     description: Get a Category by id
 *     requestBody:
 *        required: false
 *
 *     responses:
 *      201:
 *        description: Category fetched Successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CategoryOutput'
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

export const getCategoryById: RequestHandler<
  IDParams,
  CategoryOutputDTO | { message: string },
  CategoryInputDTO
> = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category as CategoryOutputDTO);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

/**
 * @openapi
 * /categories/{id}:
 *   put:
 *     tags:
 *       - Categories
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
 *     description: Update existing Category
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *      201:
 *        description: Category updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CategoryOutput'
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

export const updateCategory: RequestHandler<
  IDParams,
  CategoryOutputDTO | { message: string },
  CategoryInputDTO
> = async (req, res) => {
  try {
    const {
      params: { id },
      body,
    } = req;
    const category = await Category.findByIdAndUpdate(id, body, { new: true });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category as CategoryOutputDTO);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     tags:
 *       - Categories
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
 *     description: Delete a Category by id
 *     requestBody:
 *        required: false
 *
 *     responses:
 *      201:
 *        description: Category deleted Successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CategoryOutput'
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

export const deleteCategory: RequestHandler<
  IDParams,
  { message: string }
> = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};
