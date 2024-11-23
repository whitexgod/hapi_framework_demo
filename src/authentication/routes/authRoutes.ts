import Hapi from "@hapi/hapi";
import { AuthController } from "../controller/authController";

const authController = new AuthController();

export const authRoutes: Hapi.ServerRoute[] = [
  {
    method: "GET",
    path: "/verify-token",
    handler: async (request, h) => {
      return {
        data: null,
        message: "Valid token",
        success: true,
      };
    },
  },
  {
    method: "POST",
    path: "/sign-up",
    options: {
      auth: false,
    },
    handler: async (request, h) => {
      return await authController.signUp(request, h);
    },
  },
  {
    method: "POST",
    path: "/login",
    options: {
      auth: false,
    },
    handler: async (request, h) => {
      return await authController.login(request, h);
    },
  },
];
