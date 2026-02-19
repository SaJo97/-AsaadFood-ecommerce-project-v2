import jwt from "jsonwebtoken";

// Function to generate a JSON Web Token (JWT) for a user
export const generateToken = (user) => {
  return jwt.sign(
    {
      userInfo: {
        // Payload containing user information (matches user.model.js fields)
        _id: user._id, // User's unique ID
        email: user.loginEmail, // User's email (normalized in model)
        role: user.role, // User's role
      },
    },
    process.env.ACCESS_TOKEN_SECRET, // Secret key for signing the token from environment variables
    { expiresIn: "2h" } // Set token expiration time to 15 hours - change to 1h or 2h
  );
};