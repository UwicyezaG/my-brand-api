import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const URL = process.env.MONGODB_URL as string;
const connectDB = async () => {
  try {
    await mongoose.connect(URL);
    console.log("Connected to Database");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
};

export default connectDB;