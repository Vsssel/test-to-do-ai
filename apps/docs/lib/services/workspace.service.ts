import { createWorkspace, deleteWorkspace, getWorkspaceById, getWorkspacesByUserId, updateWorkspace } from "../db/queries/workspace"
import { NewWorkspace, Workspace } from "../db/types"
import { WORKSPACE_PERMISSIONS, WORKSPACE_ROLES } from "../values"
import { WorkspaceMemberService } from "./workspace.member.service"
import { WorkspaceRolesService } from "./workspace.roles.service"

export class WorkspaceService {
  static async createWorkspace(data: NewWorkspace): Promise<Workspace[]> {
    const result =  await createWorkspace(data)
    if(!result || !result[0]){
      throw new Error('Failed to create workspace')
    }
    await WorkspaceRolesService.createRole({
      workspaceId: result[0].id,
      roleName: WORKSPACE_ROLES.OWNER,
      permissions: WORKSPACE_PERMISSIONS.CREATE_WORKSPACE + ',' + WORKSPACE_PERMISSIONS.READ_WORKSPACE + ',' + WORKSPACE_PERMISSIONS.UPDATE_WORKSPACE + ',' + WORKSPACE_PERMISSIONS.DELETE_WORKSPACE
    })
    await WorkspaceRolesService.createRole({
      workspaceId: result[0].id,
      roleName: WORKSPACE_ROLES.EDITOR,
      permissions: WORKSPACE_PERMISSIONS.READ_WORKSPACE + ',' + WORKSPACE_PERMISSIONS.UPDATE_WORKSPACE
    })
    await WorkspaceRolesService.createRole({
      workspaceId: result[0].id,
      roleName: WORKSPACE_ROLES.VIEWER,
      permissions: WORKSPACE_PERMISSIONS.READ_WORKSPACE
    })

    const ownerRole = await WorkspaceRolesService.getRoleByName(WORKSPACE_ROLES.OWNER, result[0].id)
    if(!ownerRole || !ownerRole[0]){
      throw new Error('Failed to create owner role')
    }
    await WorkspaceMemberService.createWorkspaceMember({
      workspaceId: result[0].id,
      userId: data.ownerId,
      roleId: ownerRole[0].id
    })
    return result
  }

  static async getWorkspaceById(id: string): Promise<Workspace[]> {
    return await getWorkspaceById(id)
  }

  static async getWorkspacesByUserId(userId: string): Promise<Workspace[]> {
    return await getWorkspacesByUserId(userId)
  }

  static async deleteWorkspace(id: string): Promise<void> {
    await deleteWorkspace(id)
  }

  static async updateWorkspace(id: string, name: string): Promise<Workspace[]> {
    return await updateWorkspace(id, name)
  }
}