const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const userEmail = process.env.SENDER_EMAIL;
const password = process.env.SENDER_PASS;
const receiverEmail = process.env.RECEIVER_EMAIL;

app.use(bodyParser.json());
app.use(cors());

app.post("/submit-form", (req, res) => {
  const { name, email, query } = req.body;

  // Create a nodemailer transporter with your email service credentials
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: userEmail,
      pass: password,
    },
    debug: true,
    logger: true,
  });

  // Set up the email content
  const mailOptions = {
    from: userEmail,
    to: receiverEmail,
    subject: "New Form Submission",
    text: `Name: ${name}\nEmail: ${email}\nQuery: ${query}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    } else {
      console.log("Email sent:", info.response);
      res.json({ success: true, message: "Form submitted successfully!" });
    }
  });

  console.log(transporter);
});

app.listen(port, () => {
  console.log(`Server is listening at PORT:${port}`);
});
