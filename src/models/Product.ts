import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    unique: true,
    trim: true,
  },
  description: { type: String, required: [true, "Description is required"] },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },
});

const Product = model("Product", productSchema);
export default Product;
