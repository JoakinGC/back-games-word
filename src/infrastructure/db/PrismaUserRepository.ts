import { prisma } from "./prismaClient";
import {
  IUserRepository,
  CreateUserInput,
  ClerkUserSyncInput,
} from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

export class PrismaUserRepository implements IUserRepository {
  async create(data: CreateUserInput): Promise<User> {
    const user = await prisma.user.create({
      data: {
        clerkId: data.clerkId,
        email: data.email,
        name: data.name,
        score: data.score ?? 0,
      },
    });
    return user as User;
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } }) as any;
  }

  async findByClerkId(clerkId: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { clerkId } }) as any;
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany({ orderBy: { id: "asc" } }) as any;
  }

  async updateScore(id: number, score: number): Promise<User> {
    return prisma.user.update({ where: { id }, data: { score } }) as any;
  }

  
  async syncFromClerk({ clerkId, email, name }: ClerkUserSyncInput): Promise<User> {
    const existing = await this.findByClerkId(clerkId);
    if (existing) {
      if (existing.email !== email || existing.name !== name) {
        return prisma.user.update({
          where: { id: existing.id },
          data: { email, name },
        }) as any;
      }
      return existing;
    }
    return prisma.user.create({
      data: {
        clerkId,
        email,
        name,
      },
    }) as any;
  }
}