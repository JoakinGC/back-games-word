import { IUserRepository, CreateUserInput } from "../../domain/repositories/IUserRepository";

export class CreateUser {
  constructor(private repo: IUserRepository) {}
  async execute(data: CreateUserInput) {
    return this.repo.create(data);
  }
}