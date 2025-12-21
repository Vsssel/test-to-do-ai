import { db, WorkspaceMembersTable } from "@repo/db";
import { NewWorkspaceMember, WorkspaceMember } from "../types";
import { and, eq } from "drizzle-orm";

async function createWorkspaceMember(data: NewWorkspaceMember): Promise<WorkspaceMember[]>{
    return await db
      .insert(WorkspaceMembersTable)
      .values(data)
      .returning()
}

async function getWorkspaceMembersByWorkspaceId(workspaceId: string): Promise<WorkspaceMember[]> {
    return await db
      .select()
      .from(WorkspaceMembersTable)
      .where(eq(WorkspaceMembersTable.workspaceId, workspaceId))
}

async function getWorkspaceMembersById(workspaceId: string): Promise<WorkspaceMember[]> {
    return await db
      .select()
      .from(WorkspaceMembersTable)
      .where(eq(WorkspaceMembersTable.id, workspaceId))
}

async function getWorkspaceMemberByUserId(userId: string, workspaceId: string): Promise<WorkspaceMember[]> {
    return await db
      .select()
      .from(WorkspaceMembersTable)
      .where(and(eq(WorkspaceMembersTable.userId, userId), eq(WorkspaceMembersTable.workspaceId, workspaceId)))
}

async function deleteWorkspaceMember(id: string): Promise<void> {
    await db.delete(WorkspaceMembersTable).where(eq(WorkspaceMembersTable.id, id)).returning()
}

async function deleteWorkspaceMemberByWorkspaceId(workspaceId: string): Promise<void> {
    await db.delete(WorkspaceMembersTable).where(eq(WorkspaceMembersTable.workspaceId, workspaceId)).returning()
}

async function updateWorkspaceMemberRole(id: string, roleId: number): Promise<WorkspaceMember[]> {
    return await db.update(WorkspaceMembersTable).set({roleId}).where(eq(WorkspaceMembersTable.id, id)).returning()
}

export { createWorkspaceMember, getWorkspaceMembersByWorkspaceId, getWorkspaceMembersById, deleteWorkspaceMember, updateWorkspaceMemberRole, getWorkspaceMemberByUserId, deleteWorkspaceMemberByWorkspaceId }  