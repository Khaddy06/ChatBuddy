// app/api/uploadthing/route.ts
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Export API route handlers
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
