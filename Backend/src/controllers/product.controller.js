import mongoose from "mongoose";
import Product from "../models/product.model.js";
import asyncHandler from "express-async-handler";

// Controller to create a new product
export const createNewProduct = asyncHandler(async (req, res) => {
  const { title, brand, weight, price, image, description, type } = req.body;

  //check if all required files are provided
  if (!title || !price || !description || !brand || !weight || !image || !type) {
    return res
      .status(400)
      .json({
        message:
          "All field (title, brand, weight, price, image, description, type) is required",
      });
  }
  try {
    //create new product in the database
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    if(error instanceof mongoose.Error.ValidationError){
      return res.status(400).json({ message: "Validation error", errors: error.errors})
    }
    console.error(error)
    res.status(500).json({ message: "Error when creating product"})
  }
});

// Controller to get all products
export const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().exec(); // Fetch all products from the DB
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Controller to get a single product by ID
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params; // Get product ID from request parameters

  // Check if the ID is valid
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid product-ID" });
  }

  try {
    const product = await Product.findById(id); // Find the product by ID

    // Check if product exists
    if (!product) {
      return res.status(404).json({ message: "Can't find the product" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
});

// Controller to update a product
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, brand, weight, price, image, description } = req.body; // Destructure request body

  console.log("Incoming request body:", req.body);

  // Check if the ID is valid
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid product-ID" });
  }

  // Check if the product title is unique
  if (title) {
    const existingProduct = await Product.findOne({ title: title, _id: { $ne: id } }); // Find a product with the same title but different ID
    if (existingProduct) {
      return res.status(400).json({ message: "Product title must be unique." });
    }
  }

  const toUpdate = {}; // Object to hold fields to update
  if (title) toUpdate.title = title; // Add title to update if provided
  if (price) toUpdate.price = price; // Add price to update if provided
  if (weight) toUpdate.weight = weight; // Add price to update if provided
  if (description) toUpdate.description = description; // Add description to update if provided
  if (brand) toUpdate.brand = brand; // Add brand to update if provided
  if (image) toUpdate.image = image; // Add images to update if provided

  // Check if there are no changes to update
  if (Object.keys(toUpdate).length === 0) {
    return res.status(400).json({ message: "No changes provided" });  // return to prevent further execution
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, toUpdate, {
      new: true, // Return the updated document
    }).exec();

    // Check if the product was found and updated
    if (!updatedProduct) {
      return res.status(404).json({ message: "Can't find the product" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product" });
  }
});

// Controller to delete a product
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log("Attempting to delete product with ID:", id);

  // Check if the ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product-ID" });
  }
  try {
    const product = await Product.findByIdAndDelete(id).exec(); // Attempt to delete the product by ID
    // Check if the product was found and deleted
    if (!product) {
      return res.status(404).json({ message: `Can't find that product` });
    }
    console.log("Product deleted successfully:", product);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting product2:", error); // Log the error
    res.status(500).json({ message: "An error occurred while deleting the product." });
  }
});