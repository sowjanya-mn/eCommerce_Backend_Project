import { Router } from "express";
import {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "#controllers";

const categoryRouter = Router();

categoryRouter.get("/", getCategories);
categoryRouter.post("/", createCategory);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.put("/:id", updateCategory);
categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;
