import { Router } from "express";
import {
  createUserHandler,
  getUserHandler,
  listUsersHandler,
  syncUserHandler,
} from "../controllers/userController";
import {  requireAuth } from '@clerk/express';

export const userRoutes = Router();


userRoutes.get("/", listUsersHandler);      // GET /api/users
userRoutes.get("/:id", getUserHandler);     // GET /api/users/:id


userRoutes.post("/", requireAuth(), createUserHandler);     // POST /api/users (manual)
userRoutes.post("/sync", requireAuth(), syncUserHandler);    