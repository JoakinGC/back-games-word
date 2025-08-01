import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class GetUserById {
  constructor(private repo: IUserRepository) {}
  async execute(id: number) {
    return this.repo.findById(id);
  }
}