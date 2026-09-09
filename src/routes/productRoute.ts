import { Router } from "express";
import {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "#controllers";

const productRouter = Router();

productRouter.get("/", getAllProducts);
productRouter.post("/", createProduct);
productRouter.get("/:id", getProductById);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;
