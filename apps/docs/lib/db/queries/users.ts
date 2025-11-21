import { db, UserTable } from "@repo/db";
import { NewUser, User } from "../types";
import { eq } from "drizzle-orm";

async function createUser(data: NewUser): Promise<User[]>{
    return await db
        .insert(UserTable)
        .values(data)
        .returning()
}

async function findUserByEmail(email: string): Promise<User[]> {
    return await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.email, email))
}

export { createUser, findUserByEmail }