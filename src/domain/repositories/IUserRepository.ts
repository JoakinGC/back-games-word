import { User } from "../entities/User";

export interface CreateUserInput {
  clerkId: string;      
  email: string;
  name: string;
  score?: number;
}

export interface ClerkUserSyncInput {
  clerkId: string;
  email: string;
  name: string;
}

export interface IUserRepository {
  create(data: CreateUserInput): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByClerkId(clerkId: string): Promise<User | null>;  
  findAll(): Promise<User[]>;
  updateScore(id: number, score: number): Promise<User>;
  syncFromClerk(data: ClerkUserSyncInput): Promise<User>;
}