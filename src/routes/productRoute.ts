import { Router } from "express";
import {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "#controllers";

import { validateBody } from "#middlewares";
import { productInputSchema } from "#schemas";

const productRouter = Router();

productRouter
  .route("/")
  .get(getAllProducts)
  .post(validateBody(productInputSchema), createProduct);

productRouter
  .route("/:id")
  .get(getProductById)
  .put(validateBody(productInputSchema), updateProduct)
  .delete(deleteProduct);

export default productRouter;
