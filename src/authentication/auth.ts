import Hapi from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import { jwtStrategy } from "./strategy/auth/authStrategy";

export const registerJwtStrategy = async (server: Hapi.Server) => {
  // Register the JWT plugin
  await server.register(Jwt);

  // Register your custom JWT strategy
  server.auth.strategy(
    jwtStrategy.name, // Strategy name
    jwtStrategy.scheme, // Strategy scheme
    jwtStrategy.options // Strategy options
  );

  // Set the default authentication strategy
  server.auth.default(jwtStrategy.name);
};
