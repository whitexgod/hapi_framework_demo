import bcrypt from "bcryptjs";
import Jwt from "@hapi/jwt";
import { config } from "../../../config/config";

// Utility function to create a JWT token
export const generateToken = (userId: string): string => {
  const token = Jwt.token.generate(
    {
      id: userId, // Include user-specific claims
    },
    {
      key: config.JWT_SECRET!, // Same secret key used in the strategy
      algorithm: "HS256",
    }
  );

  return token;
};

// Utility function to validate the password using bcrypt
export const validatePassword = async (
  password: string,
  hashedPassword: string
) => {
  return bcrypt.compare(password, hashedPassword);
};

// Utility function to verify JWT token
export const verifyToken = (token: string) => {
  try {
    // Decode and verify the token
    const artifacts = Jwt.token.decode(token);
    const decoded = Jwt.token.verify(artifacts, config.JWT_SECRET!);
    return { isValid: true, payload: decoded };
  } catch (err) {
    console.error("Invalid Token:", err);
    return { isValid: false, error: err };
  }
};
