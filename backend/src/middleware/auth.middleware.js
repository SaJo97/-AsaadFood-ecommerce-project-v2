import jwt from "jsonwebtoken";

// Middleware function to verify the JSON Web Token (JWT) from httpOnly cookie
export const verifyToken = (req, res, next) => {
  // console.log("verifyToken called for:", req.path);
  try {
    // Get the token from the httpOnly cookie
    const token = req.cookies.accessToken;
    // console.log("Token from cookie:", token ? "Present" : "Missing");

    // Check if the token is present
    if (!token) {
      // console.log("No token provided");
      return res
        .status(401) // Send 401 Unauthorized if no token is provided
        .json({ message: "Not authenticated. No token provided!" });
    }

    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log("Decoded access token:", decoded);
    // Attach the decoded user information to the request object
    req.user = decoded.userInfo; // e.g., { _id, email, role }
    req.userId = decoded.userInfo._id;
    // req.userRole = decoded.userInfo.role;
    // console.log("Decoded user:", req.user);

    // Call the next middleware function in the stack
    next();
  } catch (err) {
    // console.log("JWT VERIFY ERROR:", err.message);
    // Send 401 Unauthorized if token verification fails
    return res.status(401).json({ message: "Not Authenticated" });
  }
};

export const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user.role) {
      return res
        .status(403)
        .json({ message: `Access denied: No roles assigned` });
    }

    // Check if the user's role is in the allowed roles
    if (!allowedRoles.some((role) => req.user.role === role)) {
      return res
        .status(403)
        .json({
          message: `Access denied: Requires role (${allowedRoles.join(", ")})`,
        });
    }

    next();
  };
};

// Optional middleware: Sets req.user if token is valid, but doesn't require it
export const optionalVerifyToken = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (token) {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded.userInfo; // Set user if token is valid
      req.userId = decoded.userInfo._id;
    }
    next(); // Always proceed, even without token
  } catch (err) {
    // Ignore errors (invalid/expired token) and proceed without user
    next();
  }
};
