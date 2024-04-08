import { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";

export const sendMail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 587,
    secure: false, 
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASSWORD,
    },
  });

  const { from, subject, message } = req.body;

  if (!from || !subject || !message) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const mailOptions: nodemailer.SendMailOptions = {
    to: process.env.AUTH_EMAIL,
    subject: subject,
    text: message,
  };
  const clientMailOptions: nodemailer.SendMailOptions = {
    to: from,
    subject: `Feedback From Grace`,
    text: "Your Message Have been recorded, I will get back to you soon",
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    if (info) {
      const response = await transporter.sendMail(clientMailOptions);
    }
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error occurred while sending email" });
  }
};
