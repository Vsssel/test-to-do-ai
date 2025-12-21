import { db, WorkSpaceRolesTable } from "@repo/db"
import { NewRole, Role } from "../types"
import { and, eq } from "drizzle-orm"
import { UpdateWorkspaceRoleInput } from "../../validations/schema"

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

async function deleteRoleByWorkspaceId(workspaceId: string): Promise<void> {
    await db.delete(WorkSpaceRolesTable).where(eq(WorkSpaceRolesTable.workspaceId, workspaceId)).returning()
}

async function updateRoleName(id: number, data: UpdateWorkspaceRoleInput): Promise<Role[]> {
    return await db.update(WorkSpaceRolesTable).set({ roleName: data.name, permissions: data.permissions }).where(eq(WorkSpaceRolesTable.id, id)).returning()
}

export { createRole, getRoleById, getRolesByWorkspaceId, deleteRole, updateRoleName, getRoleByName, deleteRoleByWorkspaceId }