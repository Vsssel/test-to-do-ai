import { db, StatusesTable } from "@repo/db";
import { NewStatus, Status } from "../types";
import { eq } from "drizzle-orm";
import { CreateStatusInput, UpdateStatusInput } from "../../validations/schema";

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

async function getStatusesByUserId(userId: string): Promise<Status[]> {
    return await db
        .select()
        .from(StatusesTable)
        .where(eq(StatusesTable.userId, userId))
}

async function createStatus(status: NewStatus): Promise<Status[]> {
    return await db.insert(StatusesTable).values(status).returning()
}

async function updateStatus(status: UpdateStatusInput): Promise<Status[]> {
    return await db.update(StatusesTable).set({title: status.title}).where(eq(StatusesTable.id, status.id)).returning()
}

async function deleteStatus(id: number): Promise<void> {
    await db.delete(StatusesTable).where(eq(StatusesTable.id, id)).returning()
}

async function getStatusesByWorkspaceId(workspaceId: string): Promise<Status[]> {
    return await db
        .select()
        .from(StatusesTable)
        .where(eq(StatusesTable.workspaceId, workspaceId))
}
export { getStatuses, getStatusById, getStatusByTitle, createStatus, updateStatus, deleteStatus, getStatusesByUserId, getStatusesByWorkspaceId }