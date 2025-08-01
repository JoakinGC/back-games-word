import { IWordRepository } from "../../domain/repositories/IWordRepository";

export class ListWords {
  constructor(private repo: IWordRepository) {}
  async execute() {
    return this.repo.findAll();
  }
}