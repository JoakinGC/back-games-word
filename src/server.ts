import express from "express";
import { errorHandler } from "./infrastructure/web/middlewares/errorHandler";
import { userRoutes } from "./infrastructure/web/routes/userRoutes";
import { wordRoutes } from "./infrastructure/web/routes/wordRoutes";
import { relationRoutes } from "./infrastructure/web/routes/relationRoutes";
import { clerkMiddleware } from '@clerk/express'

export function createServer() {
  const app = express();
  app.use(express.json());
  app.use(clerkMiddleware())

  app.get("/", (_req, res) => res.json({ status: "ok" }));

  app.use("/api/users", userRoutes);
  app.use("/api/words", wordRoutes);
  app.use("/api/relations", relationRoutes);

  app.use(errorHandler);

  return app;
}