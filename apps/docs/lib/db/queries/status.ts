import { db, StatusesTable } from "@repo/db";
import { Status } from "../types";
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

export { getStatuses, getStatusById, getStatusByTitle }