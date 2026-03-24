import express from "express"
import cors from "cors"
import messageRouter from "./routes/message.route.js"
import productRouter from "./routes/product.route.js"
import orderRouter from "./routes/order.route.js"
import authRouter from "./routes/user.route.js"
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import path from 'path'
import cookieParser from "cookie-parser";

const __dirname = path.resolve()
const app = express() // Create an instance of an Express application

// Middleware to parse cookies (REQUIRED for req.cookies to work)
app.use(cookieParser());
// Middleware to parse incoming JSON requests
app.use(express.json())

// Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(cors({ // kanske ta bort senare
    origin: "http://localhost:5173",
    credentials: true,
  }))
// app.use(cors())

// Define routes for different API endpoints
app.use("/api/message", messageRouter); // Route for message-related operations
app.use("/api/product", productRouter); // Route for product-related operations
app.use("/api/order", orderRouter); // Route for order-related operations
app.use("/api/auth", authRouter); // Route for auth-related operations

// Check if the application is running in production mode
if(process.env.NODE_ENV === 'production') {
  // Serve static files from the 'dist' directory
  app.use(express.static(path.join(__dirname, '../frontend/dist')))
  
  // For all other routes, send the 'index.html' file to handle client-side routing
  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'))
  })
}

// Middleware to handle 404 Not Found errors
app.use(notFound);

// Middleware to handle erros
app.use(errorHandler);

// Export the Express application for use in other parts of the application
export default app;