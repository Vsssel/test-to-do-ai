import { db, SessionTable } from "@repo/db";
import { NewSession, Session } from "../types";
import { eq } from "drizzle-orm";

export async function createSession(session: NewSession): Promise<Session> {
    const result: Session[] = await db.insert(SessionTable).values(session).returning()
    if (!result || !result[0]) {
        throw new Error("Failed to create session")
    }
    return result[0]
}

export async function findSessionByRefreshToken(refreshToken: string): Promise<Session[]> {
    return await db.select().from(SessionTable).where(eq(SessionTable.refreshToken, refreshToken)).limit(1)
}

export async function findSessionByUserId(userId: string): Promise<Session> {
    const result: Session[] = await db.select().from(SessionTable).where(eq(SessionTable.userId, userId)).limit(1)
    if (!result || !result[0]) {
        throw new Error("Failed to find session")
    }
    return result[0]
}

export async function updateSession( id: string, revoked?: boolean, revokedAt?: Date, refreshToken?: string): Promise<void> {
    await db
        .update(SessionTable)
        .set({revoked, revokedAt, refreshToken})
        .where(eq(SessionTable.id, id))
        .returning()
}

export async function deleteSession(id: string): Promise<void> {
    await db.delete(SessionTable).where(eq(SessionTable.id, id)).returning()
}