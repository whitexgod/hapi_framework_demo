import mongoose from "mongoose";
import { userSchema } from "../schema/userSchema";
import bcrypt from "bcryptjs";

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.log(error);
  }
});

// Create the User model
export const User = mongoose.model("Users", userSchema);
