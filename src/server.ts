import Hapi from "@hapi/hapi";
import { routes } from "./routes/rootRouter";
import { authPlugin } from "./authentication/plugins/auth/authPlugin";
import connectToDatabase from "./config/connectToDatabase";
import { config } from "./config/config";
import { registerJwtStrategy } from "./authentication/auth";

const init = async (): Promise<void> => {
  // Create a new Hapi server
  const server = Hapi.server({
    port: config.PORT, // Server port
    host: config.HOST, // Hostname
  });

  // Add global middleware
  server.ext("onRequest", (request, h) => {
    console.warn(
      `Incoming request: ${request.method.toUpperCase()} ${request.path}`
    );
    return h.continue;
  });

  // Register JWT strategy
  await registerJwtStrategy(server);

  // Register additional plugins
  await server.register(authPlugin);

  // Register routes
  server.route(routes);

  // Start the server
  await server.start();
  console.log(`Server running on ${server.info.uri}`);

  // Connect to DB
  connectToDatabase();
};

// Handle unexpected errors
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

// Initialize the server
init();
