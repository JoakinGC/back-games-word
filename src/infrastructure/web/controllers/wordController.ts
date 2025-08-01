import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { CreateWord } from "../../../application/words/CreateWord";
import { GetWordById } from "../../../application/words/GetWordById";
import { ListWords } from "../../../application/words/ListWords";
import { PrismaWordRepository } from "../../db/PrismaWordRepository";
import { BadRequestError, NotFoundError } from "../httpErrors";

const repo = new PrismaWordRepository();
const createWordUC = new CreateWord(repo);
const getWordByIdUC = new GetWordById(repo);
const listWordsUC = new ListWords(repo);

const createWordSchema = z.object({
  text: z.string().min(1),
  definition: z.string().min(1),
  origin: z.string().optional(),
  latin: z.string().optional(),
});

export async function createWordHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createWordSchema.parse(req.body);
    const word = await createWordUC.execute(parsed);
    res.status(201).json(word);
  } catch (err: any) {
    if (err instanceof z.ZodError) return next(new BadRequestError(err.message));
    next(err);
  }
}

export async function getWordHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new BadRequestError("Invalid word id");
    const word = await getWordByIdUC.execute(id, true);
    if (!word) throw new NotFoundError("Word not found");
    res.json(word);
  } catch (err) {
    next(err);
  }
}

export async function listWordsHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const words = await listWordsUC.execute();
    res.json(words);
  } catch (err) {
    next(err);
  }
}