import { prisma } from "./prismaClient";
import {
  IWordRepository,
  CreateWordInput,
  AddWordRelationInput,
  RelationType,
} from "../../domain/repositories/IWordRepository";
import { Word } from "../../domain/entities/Word";

export class PrismaWordRepository implements IWordRepository {
  async create(data: CreateWordInput): Promise<Word> {
    const word = await prisma.word.create({ data });
    return this.mapWord(word);
  }

  async findById(id: number, includeRelations = true): Promise<Word | null> {
    const word = await prisma.word.findUnique({
      where: { id },
      include: includeRelations
        ? {
            relationsFrom: { include: { toWord: true } },
            relationsTo: { include: { fromWord: true } },
          }
        : undefined,
    });
    if (!word) return null;
    return this.mapWordWithRelations(word);
  }

  async findAll(): Promise<Word[]> {
    const words = await prisma.word.findMany({ orderBy: { id: "asc" } });
    return words.map(this.mapWord);
  }

  async addRelation({ fromWordId, toWordId, relationType }: AddWordRelationInput): Promise<void> {
    await prisma.wordRelation.create({
      data: { fromWordId, toWordId, relationType: relationType as any },
    });
  }

  async getRelations(wordId: number): Promise<{ synonyms: Word[]; antonyms: Word[] }> {
    const rels = await prisma.wordRelation.findMany({
      where: { fromWordId: wordId },
      include: { toWord: true },
    });
    const synonyms: Word[] = [];
    const antonyms: Word[] = [];
    for (const r of rels) {
      const mapped = this.mapWord(r.toWord);
      if (r.relationType === "SYNONYM") synonyms.push(mapped);
      else if (r.relationType === "ANTONYM") antonyms.push(mapped);
    }
    return { synonyms, antonyms };
  }

  // --- Mappers ----------------------------------------------------------
  private mapWord = (w: any): Word => ({
    id: w.id,
    text: w.text,
    definition: w.definition,
    origin: w.origin ?? undefined,
    latin: w.latin ?? undefined,
  });

  private mapWordWithRelations = (w: any): Word => {
    const base = this.mapWord(w);
    const synonyms: any[] = [];
    const antonyms: any[] = [];

    
    if (w.relationsFrom) {
      for (const rel of w.relationsFrom) {
        const dto = {
          id: rel.id,
          relatedWordId: rel.toWord.id,
          relatedWordText: rel.toWord.text,
          type: rel.relationType as RelationType,
        };
        if (rel.relationType === "SYNONYM") synonyms.push(dto);
        else if (rel.relationType === "ANTONYM") antonyms.push(dto);
      }
    }

    if (w.relationsTo) {
      for (const rel of w.relationsTo) {
        const dto = {
          id: rel.id,
          relatedWordId: rel.fromWord.id,
          relatedWordText: rel.fromWord.text,
          type: rel.relationType as RelationType,
        };
        if (rel.relationType === "SYNONYM") synonyms.push(dto);
        else if (rel.relationType === "ANTONYM") antonyms.push(dto);
      }
    }

    return { ...base, synonyms, antonyms };
  };
}