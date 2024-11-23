import Hapi from "@hapi/hapi";

export const authPlugin: Hapi.Plugin<null> = {
  name: "authPlugin",
  version: "1.0.0",
  register: (server: Hapi.Server) => {
    server.ext("onPreHandler", (request, h) => {
      // Check if the route has the 'auth-required' tag
      if (request.route.settings.tags?.includes("auth-required")) {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
          // Return a response to terminate the request
          return h
            .response({
              error: "Unauthorized",
              message: "Authorization header is missing",
            })
            .code(401)
            .takeover(); // Marks this response as final
        }

        console.log(`Authorization header found: ${authHeader}`);
      }

      return h.continue;
    });
  },
};
