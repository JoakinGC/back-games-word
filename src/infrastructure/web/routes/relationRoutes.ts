import { Router } from "express";
import { addRelationHandler } from "../controllers/relationController";
import {  requireAuth } from '@clerk/express'

export const relationRoutes = Router();

relationRoutes.post("/", requireAuth, addRelationHandler); // POST /api/relations