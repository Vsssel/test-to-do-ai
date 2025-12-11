import { db, WorkSpaceRolesTable } from "@repo/db"
import { NewRole, Role } from "../types"
import { and, eq } from "drizzle-orm"

async function createRole(data: NewRole): Promise<Role[]> {
    return await db
      .insert(WorkSpaceRolesTable)
      .values(data)
      .returning()
}

async function getRoleById(id: number): Promise<Role[]> {
    return await db
      .select()
      .from(WorkSpaceRolesTable)
      .where(eq(WorkSpaceRolesTable.id, id))
}

async function getRoleByName(roleName: string, workspaceId: string): Promise<Role[]> {
    return await db
      .select()
      .from(WorkSpaceRolesTable)
      .where(and(eq(WorkSpaceRolesTable.roleName, roleName), eq(WorkSpaceRolesTable.workspaceId, workspaceId)))
}

async function getRolesByWorkspaceId(workspaceId: string): Promise<Role[]> {
    return await db
      .select()
      .from(WorkSpaceRolesTable)
      .where(eq(WorkSpaceRolesTable.workspaceId, workspaceId))
}

async function deleteRole(id: number): Promise<void> {
    await db.delete(WorkSpaceRolesTable).where(eq(WorkSpaceRolesTable.id, id)).returning()
}

async function updateRoleName(id: number, roleName: string): Promise<Role[]> {
    return await db.update(WorkSpaceRolesTable).set({roleName}).where(eq(WorkSpaceRolesTable.id, id)).returning()
}

export { createRole, getRoleById, getRolesByWorkspaceId, deleteRole, updateRoleName, getRoleByName }