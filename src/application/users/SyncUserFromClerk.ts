import { IUserRepository, ClerkUserSyncInput } from "../../domain/repositories/IUserRepository";

export class SyncUserFromClerk {
  constructor(private repo: IUserRepository) {}
  async execute(data: ClerkUserSyncInput) {
    return this.repo.syncFromClerk(data);
  }
}