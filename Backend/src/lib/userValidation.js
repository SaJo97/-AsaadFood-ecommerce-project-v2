import { rateLimit } from "express-rate-limit";
import { body, validationResult } from "express-validator";
import { isValidOrgNumber } from "../../utils/orgNumber.js";

const isDev = process.env.NODE_ENV !== "production";
// Rate limiter for login: 5 attempts per 15 min
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min in milliseconds
  max: isDev ? 100 : 5, // Limit each IP to 5 requests per windowMs
  message: "För många inloggningsförsök, försök igen senare.",
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// Rate limiter for register: 3 attempts per 15 min (stricter for sign-ups)
export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: isDev ? 100 : 3,
  message: "För många registreringsförsök, försök igen senare.",
  standardHeaders: true,
  legacyHeaders: false,
});

const phoneRegex = /^(?:\+46|0046|0)7[02369]\d{7}$/;
const postalCodeRegex = /^\d{3}\s?\d{2}$/;
const cityRegex = /^[A-Za-zÅÄÖåäö\s-]+$/;
// Validation rules for register
export const registerValidation = [
  body("loginEmail")
    .isEmail()
    .normalizeEmail()
    .withMessage("Ogiltig e-postadress"),

  body("invoiceEmail")
    .isEmail()
    .normalizeEmail()
    .withMessage("Ogiltig faktura-e-post"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Lösenordet måste vara minst 6 tecken"),

  body("firstName").trim().notEmpty().withMessage("Förnamn krävs"),

  body("lastName").trim().notEmpty().withMessage("Efternamn krävs"),

  body("phone")
    .trim()
    .custom((value) => {
      const clean = value.replace(/\s|-/g, "");
      if (!phoneRegex.test(clean)) {
        throw new Error("Ogiltigt telefonnummer");
      }
      return true;
    })
    .withMessage("Ogiltigt telefonnummer"),

  body("companyName").trim().notEmpty().withMessage("Företagsnamn krävs"),

  body("orgNumber")
    .custom(isValidOrgNumber)
    .withMessage("Ogiltigt organisationsnummer"),

  body("streetAddress").trim().notEmpty().withMessage("Gatuadress krävs"),

  body("postalCode")
    .trim()
    .matches(postalCodeRegex)
    .isPostalCode('SE')
    .withMessage("Ogiltigt postnummer"),

  body("city").trim().matches(cityRegex).withMessage("Ogiltig ort"),

  // body("role")
  //   .optional()
  //   .isIn(Object.values(ROLES))
  //   .withMessage("Ogiltig roll"),
];

// Validation rules for login
export const loginValidation = [
  body("loginEmail")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(400).json({ errors: errors.array() }); // Return validation errors as JSON
  }
  next(); // Proceed if no errors
};
