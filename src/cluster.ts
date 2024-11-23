import Hapi from "@hapi/hapi";
import { routes } from "./routes/rootRouter";
import { authPlugin } from "./authentication/plugins/auth/authPlugin";
import connectToDatabase from "./config/connectToDatabase";
import { config } from "./config/config";
import { registerJwtStrategy } from "./authentication/auth";
import cluster from "cluster";
import os from "os";

const initServer = async (): Promise<Hapi.Server> => {
  const server = Hapi.server({
    port: config.PORT, // Server port
    host: config.HOST, // Hostname
    router: { isCaseSensitive: false },
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

  // Connect to DB
  connectToDatabase();

  return server;
};

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  console.log(`Primary process ${process.pid} is running`);
  console.log(`Forking ${numCPUs} workers...`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker exit
  cluster.on("exit", (worker, code, signal) => {
    console.error(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  (async () => {
    try {
      const server = await initServer();
      await server.start();
      console.log(
        `Worker process ${process.pid} started server on ${server.info.uri}`
      );
    } catch (err) {
      console.error(`Worker process ${process.pid} failed to start`, err);
      process.exit(1);
    }
  })();
}

// Handle unexpected errors
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});
