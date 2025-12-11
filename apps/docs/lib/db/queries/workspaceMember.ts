import { db, WorkspaceMembersTable } from "@repo/db";
import { NewWorkspaceMember, WorkspaceMember } from "../types";
import { eq } from "drizzle-orm";

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

async function getWorkspaceMembersByUserId(userId: string): Promise<WorkspaceMember[]> {
    return await db
      .select()
      .from(WorkspaceMembersTable)
      .where(eq(WorkspaceMembersTable.userId, userId))
}

async function deleteWorkspaceMember(id: string): Promise<void> {
    await db.delete(WorkspaceMembersTable).where(eq(WorkspaceMembersTable.id, id)).returning()
}

async function updateWorkspaceMemberRole(id: string, roleId: number): Promise<WorkspaceMember[]> {
    return await db.update(WorkspaceMembersTable).set({roleId}).where(eq(WorkspaceMembersTable.id, id)).returning()
}

export { createWorkspaceMember, getWorkspaceMembersByWorkspaceId, getWorkspaceMembersByUserId, deleteWorkspaceMember, updateWorkspaceMemberRole }  