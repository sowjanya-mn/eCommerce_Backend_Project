import type { RequestHandler } from "express";
import { Category } from "#models";
import type { CategoryType } from "#types";

export const getCategories: RequestHandler = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const createCategory: RequestHandler = async (req, res) => {
  try {
    const { name } = req.body as CategoryType;
    const category = await Category.create({ name } satisfies CategoryType);
    res.status(201).json(category);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const getCategoryById: RequestHandler = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const updateCategory: RequestHandler = async (req, res) => {
  try {
    const {
      params: { id },
      body,
    } = req;
    const category = await Category.findByIdAndUpdate(id, body, { new: true });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const deleteCategory: RequestHandler = async (req, res) => {
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
