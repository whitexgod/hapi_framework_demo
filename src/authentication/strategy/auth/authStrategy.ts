import Hapi from "@hapi/hapi";
import { config } from "../../../config/config";
import { User } from "../../model/userModel";

export const jwtStrategy = {
  name: "jwt",
  scheme: "jwt",
  options: {
    keys: config.JWT_SECRET!, // Replace with a secure secret key
    verify: {
      aud: false, // Adjust audience if needed
      iss: false, // Adjust issuer if needed
      sub: false, // Adjust subject if needed
      nbf: true,
      exp: true,
    },
    validate: async (
      artifacts: any,
      request: Hapi.Request,
      h: Hapi.ResponseToolkit
    ) => {
      // Custom validation logic (e.g., check user existence in the database)
      const userId = artifacts.decoded.payload.id; // Extract user ID from token
      const user = await User.findById(userId);
      if (!user) {
        return { isValid: false };
      }

      return {
        isValid: true,
        credentials: { userId },
      };
    },
  },
};
