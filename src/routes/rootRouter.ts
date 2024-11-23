import Hapi from "@hapi/hapi";
import { authRoutes } from "../authentication/routes/authRoutes";

// Define the routes
export const routes: Hapi.ServerRoute[] = [
  {
    method: "GET",
    path: "/",
    options: {
      auth: false,
    },
    handler: (request, h) => {
      return { message: `Hello from worker ${process.pid}` };
    },
  },
  {
    method: "GET",
    path: "/health",
    options: {
      auth: false,
    },
    handler: (request, h) => {
      return { status: "Server is healthy" };
    },
  },
  ...authRoutes,
];
