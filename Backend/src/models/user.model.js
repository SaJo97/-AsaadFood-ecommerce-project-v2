import mongoose from "mongoose";
import ROLES from "../constants/roles.js";

const userSchema = new mongoose.Schema(
  {
    // Login
    loginEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (v) =>
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
        message: "Invalid email format",
      },
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minglength: 6,
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.ADMIN, // change later to memeber
    },

    // Contact person
    contactPerson: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      phone: {
        type: String, 
        required: true,
        trim: true,
        validate: {
          validator: (v) => /^\d{7,15}$/.test(v),
          set: (v) => v.replace(/\s|-/g, ""),
          message: "Phone number must be 7–15 digits",
        },
      },
    },

    // Company
    company: {
      name: {
        type: String,
        required: true,
      },
      orgNumber: {
        type: String, // XXXXXX-XXXX
        required: true,
        // unique: true,
        trim: true
      },
      address: {
        street: {
          type: String,
          required: true,
        },
        postalCode: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
      },
    },

    // Invoice
    invoiceEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) =>
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
        message: "Invalid email format",
      },
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
