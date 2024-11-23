import Hapi from "@hapi/hapi";
import { User } from "../model/userModel";
import { SignUp } from "../interface/signUp";
import {
  generateToken,
  validatePassword,
  verifyToken,
} from "../utils/auth/authUtils";
import { VerifyToken } from "../interface/verifyToken";

export class AuthController {
  signUp = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const { email, password } = request.payload as SignUp;
      console.log({ email, password });
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return {
          data: null,
          message: "Email already taken",
          success: false,
        };
      }

      // Create a new user
      const user = new User({ email, password });
      await user.save();
      console.log("User created successfully:", user);

      return {
        data: null,
        message: "User created successfully",
        success: true,
      };
    } catch (error) {
      console.log(error);
    }
  };

  login = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const { email, password } = request.payload as SignUp;
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        console.log("User doesn't exists");
        return {
          data: null,
          message: "User not found",
          success: false,
        };
      }

      const isValid = await validatePassword(password, existingUser.password);

      if (isValid) {
        const token = generateToken(existingUser._id.toString());
        return {
          data: { token },
          message: "Login successful",
          success: true,
        };
      }
      return {
        data: null,
        message: "Invalid credentials",
        success: false,
      };
    } catch (error) {
      console.log(error);
    }
  };
}
