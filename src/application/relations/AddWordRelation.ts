import { IWordRepository, AddWordRelationInput } from "../../domain/repositories/IWordRepository";

export class AddWordRelation {
  constructor(private repo: IWordRepository) {}
  async execute(data: AddWordRelationInput) {
    await this.repo.addRelation(data);
    return { success: true };
  }
}