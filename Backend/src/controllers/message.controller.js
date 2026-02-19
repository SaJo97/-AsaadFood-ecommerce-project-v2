import asyncHandler from "express-async-handler";
import { createTransport } from "nodemailer";  // For sending emails

// Create transporter for email sending (configure with your SMTP provider)
const transporter = createTransport({
  service: 'gmail',  // Or your provider (e.g., 'outlook')
  auth: {
    user: process.env.EMAIL_USER,  // Your email (e.g., 'yourgmail@gmail.com')
    pass: process.env.EMAIL_PASS,  // Your email password or app password
  },
});

export const sendMessage = asyncHandler(async (req, res) => {
  let contactPerson, email;
  const { message, contactPerson: bodyContactPerson, email: bodyEmail } = req.body;

  // If user is logged in, auto-fill from user data; otherwise, require from body
  if (req.user) {
    contactPerson = req.user.contactPerson;  // Auto-fill from logged-in user
    email = req.user.email;  // Auto-fill from logged-in user
  } else {
    contactPerson = bodyContactPerson;  // Require from request body
    email = bodyEmail;  // Require from request body
  }

  // Validate required fields
  if (!contactPerson || !email || !message) {
    return res.status(400).json({ message: "Alla fält måste fyllas." });
  }

  try {
    // Email options
    const mailOptions = {
      from: email,  // Sender's email
      to: process.env.ADMIN_EMAIL || 'admin@example.com',  // Specific recipient email
      subject: 'Nytt meddelande från användare',
      text: `Kontaktperson: ${contactPerson}\nE-post: ${email}\nMeddelande: ${message}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Meddelandet har skickats!" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Ett fel uppstod när meddelandet skickades." });
  }
});