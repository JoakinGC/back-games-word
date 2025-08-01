export interface WordRelationDTO {
  id: number;
  relatedWordId: number;
  relatedWordText: string;
  type: "SYNONYM" | "ANTONYM";
}

export interface Word {
  id: number;
  text: string;
  definition: string;
  origin?: string | null;
  latin?: string | null;
  synonyms?: WordRelationDTO[]; 
  antonyms?: WordRelationDTO[]; 
}