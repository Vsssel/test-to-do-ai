import { createRole, deleteRole, getRoleById, getRoleByName, getRolesByWorkspaceId, updateRoleName } from "../db/queries/role"
import { NewWorkSpaceRoles, Role } from "../db/types"
import { UpdateWorkspaceRoleInput } from "../validations/schema"

export class WorkspaceRolesService {
  static async createRole(data: NewWorkSpaceRoles): Promise<Role[]> {
    return await createRole(data)
  }

  static async getRoleByName(roleName: string, workspaceId: string): Promise<Role[]> {
    return await getRoleByName(roleName, workspaceId)
  }

  static async getRolesByWorkspaceId(workspaceId: string): Promise<Role[]> {
    return await getRolesByWorkspaceId(workspaceId)
  }

  static async getRoleById(id: number): Promise<Role[]> {
    return await getRoleById(id)
  }

  static async deleteRole(id: number): Promise<void> {
    await deleteRole(id)
  }

  static async updateRole(id: number, data: UpdateWorkspaceRoleInput): Promise<Role[]> {
    return await updateRoleName(id, data)
  }
} 