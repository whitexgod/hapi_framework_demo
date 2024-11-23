import mongoose from "mongoose";
import { config } from "./config";

const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.DB_URI!);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Exit the application if the connection fails
  }
};

export default connectToDatabase;
