import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AddWordRelation } from "../../../application/relations/AddWordRelation";
import { PrismaWordRepository } from "../../db/PrismaWordRepository";
import { BadRequestError } from "../httpErrors";

const repo = new PrismaWordRepository();
const addRelationUC = new AddWordRelation(repo);

const relationSchema = z.object({
  fromWordId: z.number().int(),
  toWordId: z.number().int(),
  relationType: z.enum(["SYNONYM", "ANTONYM"]),
});

export async function addRelationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = relationSchema.parse(req.body);
    await addRelationUC.execute(parsed);
    res.status(201).json({ success: true });
  } catch (err: any) {
    if (err instanceof z.ZodError) return next(new BadRequestError(err.message));
    next(err);
  }
}