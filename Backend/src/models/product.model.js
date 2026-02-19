import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    weight: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },//Rice / Oliveoil
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
