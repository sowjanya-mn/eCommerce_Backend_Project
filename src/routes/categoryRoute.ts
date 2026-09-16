import { Router } from "express";
import {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "#controllers";

import { validateBody } from "#middlewares";
import { categoryInputSchema } from "#schemas";

const categoryRouter = Router();

categoryRouter
  .route("/")
  .get(getCategories)
  .post(validateBody(categoryInputSchema), createCategory);
categoryRouter
  .route("/:id")
  .get(getCategoryById)
  .put(validateBody(categoryInputSchema), updateCategory)
  .delete(deleteCategory);

export default categoryRouter;
