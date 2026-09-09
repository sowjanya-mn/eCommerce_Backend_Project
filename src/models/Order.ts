import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  total: {
    type: Number,
    required: [true, "Total is required"],
  },
});

const Order = model("Order", orderSchema);
export default Order;
