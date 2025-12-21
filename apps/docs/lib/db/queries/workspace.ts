import { db, WorkspacesTable } from "@repo/db";
import { NewWorkspace, Workspace } from "../types";
import { eq } from "drizzle-orm";

async function createWorkspace(data: NewWorkspace): Promise<Workspace[]>{
  return await db
    .insert(WorkspacesTable)
    .values(data)
    .returning()
}

async function getWorkspaceById(id: string): Promise<Workspace[]> {
  return await db
    .select()
    .from(WorkspacesTable)
    .where(eq(WorkspacesTable.id, id))
}

async function getWorkspacesByUserId(userId: string): Promise<Workspace[]> {
  return await db
    .select()
    .from(WorkspacesTable)
    .where(eq(WorkspacesTable.ownerId, userId))
}

async function deleteWorkspace(id: string): Promise<void> {
  await db
    .delete(WorkspacesTable)
    .where(eq(WorkspacesTable.id, id))
}

async function updateWorkspace(id: string, name: string): Promise<Workspace[]> {
  return await db.update(WorkspacesTable).set({name}).where(eq(WorkspacesTable.id, id)).returning()
}

export { createWorkspace, getWorkspaceById, getWorkspacesByUserId, deleteWorkspace, updateWorkspace }