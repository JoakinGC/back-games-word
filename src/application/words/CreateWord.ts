import { IWordRepository, CreateWordInput } from "../../domain/repositories/IWordRepository";

export class CreateWord {
  constructor(private repo: IWordRepository) {}
  async execute(data: CreateWordInput) {
    return this.repo.create(data);
  }
}