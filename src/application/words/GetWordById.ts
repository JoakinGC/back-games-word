import { IWordRepository } from "../../domain/repositories/IWordRepository";

export class GetWordById {
  constructor(private repo: IWordRepository) {}
  async execute(id: number, includeRelations = true) {
    return this.repo.findById(id, includeRelations);
  }
}