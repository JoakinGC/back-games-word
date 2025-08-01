import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { CreateUser } from "../../../application/users/CreateUser";
import { SyncUserFromClerk } from "../../../application/users/SyncUserFromClerk";
import { GetUserById } from "../../../application/users/GetUserById";
import { ListUsers } from "../../../application/users/ListUsers";
import { PrismaUserRepository } from "../../db/PrismaUserRepository";
import { BadRequestError, NotFoundError } from "../httpErrors";

const repo = new PrismaUserRepository();
const createUserUC = new CreateUser(repo);
const syncUserUC = new SyncUserFromClerk(repo);
const getUserByIdUC = new GetUserById(repo);
const listUsersUC = new ListUsers(repo);


const createUserSchema = z.object({
  clerkId: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
  score: z.number().int().optional(),
});

export async function createUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createUserSchema.parse(req.body);
    const user = await createUserUC.execute(parsed);
    res.status(201).json(user);
  } catch (err: any) {
    if (err instanceof z.ZodError) return next(new BadRequestError(err.message));
    next(err);
  }
}


export async function syncUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const clerkClaims: any = (req as any).clerkUser; 
    if (!clerkClaims?.sub) throw new BadRequestError("Missing Clerk claims");

    const clerkId = clerkClaims.sub;
    const email = clerkClaims.email ?? clerkClaims.primary_email_address_id ?? "unknown@example.com";
    const name = clerkClaims.name ?? clerkClaims.first_name ?? "Usuario";

    const user = await syncUserUC.execute({ clerkId, email, name });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function getUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) throw new BadRequestError("Invalid user id");
    const user = await getUserByIdUC.execute(id);
    if (!user) throw new NotFoundError("User not found");
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function listUsersHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await listUsersUC.execute();
    res.json(users);
  } catch (err) {
    next(err);
  }
}