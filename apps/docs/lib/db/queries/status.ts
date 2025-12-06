import { db, StatusesTable } from "@repo/db";
import { NewStatus, Status } from "../types";
import { eq } from "drizzle-orm";

async function getStatuses(): Promise<Status[]> {
    return await db
        .select()
        .from(StatusesTable)
}

async function getStatusByTitle(title: string): Promise<Status[]> {
    return await db
        .select()
        .from(StatusesTable)
        .where(eq(StatusesTable.title, title))
        .limit(1)
}

async function getStatusById(id: number): Promise<Status[]> {
    return await db
        .select()
        .from(StatusesTable)
        .where(eq(StatusesTable.id, id))
        .limit(1)
}

async function createStatus(status: NewStatus): Promise<void> {
    await db.insert(StatusesTable).values(status).returning()
}

async function updateStatus(status: Status): Promise<void> {
    await db.update(StatusesTable).set(status).where(eq(StatusesTable.id, status.id)).returning()
}

async function deleteStatus(id: number): Promise<void> {
    await db.delete(StatusesTable).where(eq(StatusesTable.id, id)).returning()
}

export { getStatuses, getStatusById, getStatusByTitle, createStatus, updateStatus, deleteStatus }