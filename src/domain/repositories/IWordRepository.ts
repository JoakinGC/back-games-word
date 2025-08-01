import { Word } from "../entities/Word";

export interface CreateWordInput {
  text: string;
  definition: string;
  origin?: string | null;
  latin?: string | null;
}

export type RelationType = "SYNONYM" | "ANTONYM";

export interface AddWordRelationInput {
  fromWordId: number;
  toWordId: number; 
  relationType: RelationType;
}

export interface IWordRepository {
  create(data: CreateWordInput): Promise<Word>;
  findById(id: number, includeRelations?: boolean): Promise<Word | null>;
  findAll(): Promise<Word[]>;
  addRelation(data: AddWordRelationInput): Promise<void>;
  getRelations(wordId: number): Promise<{ synonyms: Word[]; antonyms: Word[] }>;
}