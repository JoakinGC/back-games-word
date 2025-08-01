import { Router } from "express";
import { createWordHandler, getWordHandler, listWordsHandler } from "../controllers/wordController";
import {  requireAuth } from '@clerk/express';

export const wordRoutes = Router();

wordRoutes.get("/", listWordsHandler);       // GET /api/words (público)
wordRoutes.get("/:id", getWordHandler);      // GET /api/words/:id (público)
wordRoutes.post("/", requireAuth(), createWordHandler); 