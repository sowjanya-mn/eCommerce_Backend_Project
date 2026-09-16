import { Product, Category } from "#models";
import type { ProductType } from "#types";
import type { RequestHandler } from "express";
import { Types } from "mongoose";
import { productInputSchema } from "#schemas";
import { z } from "zod";

type ProductInputDTO = z.infer<typeof productInputSchema>;
type ProductOutputDTO = ProductInputDTO & {
  _id: InstanceType<typeof Types.ObjectId>;
  createdAt: Date;
  updatedAt: Date;
};
type IDParams = {
  id: string;
};

/**
 * @openapi
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     description: Get all products
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter products by a specific Category ID
 *
 *     responses:
 *      201:
 *        description: Products fetched Successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProductOutput'
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

export const getAllProducts: RequestHandler<
  unknown,
  ProductOutputDTO[] | { error: string }
> = async (req, res, next) => {
  try {
    const { categoryId } = req.query;

    const filter = typeof categoryId === "string" ? { categoryId } : {};

    const products = await Product.find(filter).lean();

    const formattedProducts: ProductOutputDTO[] = (products as any[]).map(
      (product) => ({
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId ? product.categoryId.toString() : "",
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }),
    );

    return res.json(formattedProducts);
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /products:
 *   post:
 *     tags:
 *       - Products
 *     description: Create a new product
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProductInput'
 *     responses:
 *      201:
 *        description: Product created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProductOutput'
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

export const createProduct: RequestHandler<
  unknown,
  ProductOutputDTO | { error: string },
  ProductInputDTO
> = async (req, res) => {
  try {
    const { name, description, price, categoryId } = req.body;

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res
        .status(400)
        .json({ error: "Invalid categoryId. Category does not exist." });
    }

    const product = await Product.create({
      name,
      description,
      price,
      categoryId,
    });

    const plainProduct = product.toObject();

    const formattedProduct: ProductOutputDTO = {
      _id: plainProduct._id,
      name: plainProduct.name,
      description: plainProduct.description,
      price: plainProduct.price,
      categoryId: plainProduct.categoryId.toString(),
      createdAt: (plainProduct as any).createdAt,
      updatedAt: (plainProduct as any).updatedAt,
    };

    return res.status(201).json(formattedProduct);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Error creating product" });
  }
};

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
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
 *     description: Get a product by id
 *     requestBody:
 *        required: false
 *
 *     responses:
 *      201:
 *        description: Product fetched Successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProductOutput'
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

export const getProductById: RequestHandler<
  IDParams,
  ProductOutputDTO | { error: string },
  ProductInputDTO
> = async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;

    const product = await Product.findById(id).populate("categoryId").lean();

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productDTO: ProductOutputDTO = {
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId.toString(),
      _id: product._id,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    return res.json(productDTO);
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     tags:
 *       - Products
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
 *     description: Update existing product
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProductInput'
 *     responses:
 *      201:
 *        description: Product updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProductOutput'
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

export const updateProduct: RequestHandler<
  IDParams,
  ProductOutputDTO | { error: string },
  ProductInputDTO
> = async (req, res, next) => {
  try {
    const {
      params: { id },
      body,
    } = req;

    if (body.categoryId) {
      const categoryExists = await Category.findById(body.categoryId);
      if (!categoryExists) {
        return res
          .status(400)
          .json({ error: "Invalid categoryId. Category does not exist." });
      }
    }

    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
    }).lean();

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productDTO: ProductOutputDTO = {
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId.toString(),
      _id: product._id,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    return res.json(productDTO);
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     tags:
 *       - Products
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
 *     description: Delete a product by id
 *     requestBody:
 *        required: false
 *
 *     responses:
 *      201:
 *        description: Product deleted Successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProductOutput'
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

export const deleteProduct: RequestHandler<
  IDParams,
  { message: string }
> = async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;

    const product = await Product.findByIdAndDelete(id).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};
