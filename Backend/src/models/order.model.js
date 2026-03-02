import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userInfo: {
      name: String,
      email: String,
      company: {
        name: String,
        orgNumber: String,
        address: {
          street: String,
          postalCode: String,
          city: String,
        },
      },
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
