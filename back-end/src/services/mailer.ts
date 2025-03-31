import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.userMAIL,
    pass: process.env.userPASS,
  },
});

export default transporter;
