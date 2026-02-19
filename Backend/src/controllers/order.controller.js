import asyncHandler from "express-async-handler";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { products } = req.body;

  // Check if user ID is provided (set by verifyToken middleware)
  if (!req.userId) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  // Validate products array
  if (!Array.isArray(products) || products.length === 0) {
    res.status(400);
    throw new Error("Products array is required");
  }
  // Get product information based on product IDs
  const productIds = products.map((p) => p.productId).filter((id) => id); // Filter out invalid IDs
  const productDetails = await Product.find({
    _id: { $in: productIds },
  });
  if (productDetails.length !== products.length) {
    res.status(400);
    throw new Error("One or more products are invalid");
  }

  let totalPrice = 0; // Initialize total price

  // Calculate total price for the order
  for (const item of products) {
    const product = productDetails.find(
      (p) => p._id.toString() === item.productId.toString(),
    );

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      res.status(400);
      throw new Error("Invalid product quantity");
    }

    totalPrice += product.price * item.quantity;
  }

  // Ensure total price is valid
  if (totalPrice <= 0) {
    return res
      .status(400)
      .json({ message: "Invalid order: no valid products or quantities" });
  }

  // Create a new order with the calculated total price
  const order = await Order.create({
    userId: req.userId,
    products,
    totalPrice,
  });

  res.status(201).json(order);
});

// Controller to get the order history for a user
export const getOrderHistory = asyncHandler(async (req, res) => {
  try {
    // Find all orders for the authenticated user and populate product details
    const orders = await Order.find({ userId: req.userId })
      .populate({
        path: "products.productId", // Populate product details
        select: "title image price", // Select specific fields
      })
      .exec();

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching order history:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching order history" });
  }
});

// Controller to get a specific order by ID
export const getOrderHistoryId = asyncHandler(async (req, res) => {
  const { orderId } = req.params; // Get the order ID from request parameters

  try {
    // Find the order by ID and ensure it belongs to the authenticated user
    const order = await Order.findOne({ _id: orderId, userId: req.userId })
      .populate("products.productId") // Populate product details
      .exec();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the order" });
  }
});
