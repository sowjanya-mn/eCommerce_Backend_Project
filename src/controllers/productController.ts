import { Product } from "#models";
import type { ProductType } from "#types";
import type { RequestHandler } from "express";

export const getAllProducts: RequestHandler = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const filter =
      typeof categoryId === "string" ? { category: categoryId } : {};

    const products = await Product.find(filter).populate("category");
    res.json(products);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error fetching products" });
    }
  }
};

export const createProduct: RequestHandler = async (req, res) => {
  try {
    const { name, description, price, category } = req.body as ProductType;
    const product = await Product.create({
      name,
      description,
      price,
      category,
    } satisfies ProductType);
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error creating product" });
    }
  }
};

export const getProductById: RequestHandler = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const product = await Product.findById(id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error fetching product" });
    }
  }
};

export const updateProduct: RequestHandler = async (req, res) => {
  try {
    const {
      params: { id },
      body,
    } = req;

    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
    }).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error updating product" });
    }
  }
};

export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error deleting product" });
    }
  }
};
