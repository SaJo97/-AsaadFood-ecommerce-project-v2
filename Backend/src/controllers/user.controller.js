import ROLES from "../constants/roles.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/generateToken.js";
import asyncHandler from "express-async-handler";

// Controller to handle user registration
export const register = asyncHandler(async (req, res) => {
  const {
    loginEmail,
    password,
    invoiceEmail,

    firstName,
    lastName,
    phone,

    companyName,
    orgNumber,
    streetAddress,
    postalCode,
    city,

    role = ROLES.ADMIN, // member
  } = req.body;

  // Normalize email: trim and lowercase
  const normalizedLoginEmail = loginEmail.trim().toLowerCase();
  const normalizedInvoiceEmail = invoiceEmail.trim().toLowerCase();

  // Check if all required fields are provided
  if (
    !normalizedLoginEmail ||
    !password ||
    !normalizedInvoiceEmail ||
    !firstName ||
    !lastName ||
    !phone ||
    !companyName ||
    !orgNumber ||
    !streetAddress ||
    !postalCode ||
    !city
  ) {
    return res.status(400).json({ message: "Alla fält är obligatoriska" });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ loginEmail: normalizedLoginEmail });
  if (existingUser) {
    return res.status(409).json({ message: "Användare finns redan" });
  }

  // Validate role if provided
  if (!Object.values(ROLES).includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const user = await User.create({
    loginEmail: normalizedLoginEmail,
    invoiceEmail: normalizedInvoiceEmail,
    password: hashedPassword,
    role,

    contactPerson: {
      firstName,
      lastName,
      phone,
    },

    company: {
      name: companyName,
      orgNumber,
      address: {
        street: streetAddress,
        postalCode,
        city,
      },
    },
  });

  // Generate token
  const token = generateToken(user);

  // Set httpOnly cookie with the token (secure, client can't access)
  res.cookie('jwt', token, {
    httpOnly: true,  // Prevents client-side access (better security)
    secure: process.env.NODE_ENV === 'production',  // Use HTTPS in production
    sameSite: 'strict',  // CSRF protection
    maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
  });

  // Return user data (excluding password) and token
  res.status(201).json({
    user: {
      _id: user._id,
      loginEmail: user.loginEmail,
      invoiceEmail: user.invoiceEmail,
      role: user.role,
      contactPerson: user.contactPerson,
      company: user.company,
      createdAt: user.createdAt,
    },
    token,
  });
});

// Controller to handle user login
export const login = asyncHandler(async (req, res) => {
  const { loginEmail, password } = req.body;

  if (!loginEmail || !password) {
  return res.status(400).json({
    message: "E-postadress och lösenord krävs",
  });
}

  // Normalize email: trim and lowercase
  const normalizedEmail = loginEmail.trim().toLowerCase();

  // Check if email and password are provided
  if (!normalizedEmail || !password) {
    return res.status(400).json({ message: "E-postadress och lösenord krävs" });
  }

  // Find user by normalized email
  const user = await User.findOne({ loginEmail: normalizedEmail });
  if (!user) {
    return res.status(401).json({ message: "Ogiltig e-postadress eller lösenord" });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Ogiltig e-postadress eller lösenord" });
  }

  // Generate token
  const token = generateToken(user);

  // Set httpOnly cookie with the token
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
  });

  // Return user data (excluding password) and token
  res.status(200).json({
     user: {
      _id: user._id,
      loginEmail: user.loginEmail,
      invoiceEmail: user.invoiceEmail,
      role: user.role,
      contactPerson: user.contactPerson,
      company: user.company,
    },
    token,
  });
});

// Controller to handle get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().exec();
  res.status(200).json(users);
});

// Controller to handle get one user by ID
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "Användare hittades inte" });
  }

  res.status(200).json(user);
});

// Controller to handle get current user (using JWT token)
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select("-password"); // Exclude password for security
  if (!user) {
    return res.status(404).json({ message: "Användare hittades inte" });
  }
  res.status(200).json(user);
});

// Update user (only specific fields: password, phoneNumber, invoiceEmail, companyAddress(streetAddress, postalCode, city,))
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    password,
    phone,
    invoiceEmail,
    streetAddress,
    postalCode,
    city,
  } = req.body;

  // Find the user
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "Användare hittades inte" });
  }
  if (password) {
    user.password = await bcrypt.hash(password, 10); // Hash new password
  }
  if (phone !== undefined) user.contactPerson.phone = phone;
  if (streetAddress !== undefined) user.company.address.street = streetAddress;
  if (postalCode !== undefined) user.company.address.postalCode = postalCode;
  if (city !== undefined) user.company.address.city = city;
  if (invoiceEmail !== undefined) user.invoiceEmail = invoiceEmail.toLowerCase();

  // Update the user
  await user.save();
  res.status(200).json(user);
});

// Update user role
export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params; 
  const { role } = req.body;
  
  // Check if the role is valid
  if (!Object.values(ROLES).includes(role)) {
    return res.status(400).json({ message: "Invalid role" }); // Return a 400 Bad Request if the role is invalid
  }
  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  if (!user) {
    return res.status(404).json({ message: "Användare hittades inte" }); // Handle case where user is not found
  }
  res.status(200).json(user);
});

// Delete a user
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).json({ message: "Användare hittades inte" });
  }

  res.status(204).send(); // No content
});

// export const logout = asyncHandler(async (req, res) => {
//   res.cookie('jwt', '', { maxAge: 1 });  // Clear cookie
//   res.status(200).json({ message: 'Utloggad' });
// });

export const logout = asyncHandler(async (req, res) => {
  // Clear the 'jwt' cookie
  res.clearCookie('jwt', {
    httpOnly: true,        // Ensures the cookie can't be accessed via JavaScript
    secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only sent over HTTPS in production
    sameSite: 'strict',    // Helps prevent CSRF attacks
    path: '/',             // The path to which the cookie is valid
  });

  // Respond with a message indicating successful logout
  res.status(200).json({ message: 'Utloggad' });
});

export const checkAuth = asyncHandler(async (req, res) => {
  // Prevent caching for auth-dependent responses
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  
  const user = await User.findById(req.userId).select("loginEmail role"); 
    if (!user) {
      return res.status(404).json({ message: "Användare hittades inte" });
    }
    console.log("User found:", user);
    res.json({ email: user.loginEmail, role: user.role });
})