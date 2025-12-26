import { deleteInvitationByWorkplaceId } from "../db/queries/invitations"
import { deleteRoleByWorkspaceId } from "../db/queries/role"
import { createWorkspace, deleteWorkspace, getWorkspaceById, getWorkspacesByUserId, updateWorkspace } from "../db/queries/workspace"
import { deleteWorkspaceMemberByWorkspaceId } from "../db/queries/workspaceMember"
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
      permissions: 
        WORKSPACE_PERMISSIONS.CREATE_WORKSPACE + ',' + 
        WORKSPACE_PERMISSIONS.READ_WORKSPACE + ',' + 
        WORKSPACE_PERMISSIONS.UPDATE_WORKSPACE + ',' + 
        WORKSPACE_PERMISSIONS.DELETE_WORKSPACE + ',' + 
        WORKSPACE_PERMISSIONS.CREATE_ROLE + ',' + 
        WORKSPACE_PERMISSIONS.READ_ROLE + ',' + 
        WORKSPACE_PERMISSIONS.UPDATE_ROLE + ',' + 
        WORKSPACE_PERMISSIONS.DELETE_ROLE + ',' + 
        WORKSPACE_PERMISSIONS.CREATE_INVITATION + ',' + 
        WORKSPACE_PERMISSIONS.READ_INVITATION + ',' + 
        WORKSPACE_PERMISSIONS.UPDATE_INVITATION + ',' + 
        WORKSPACE_PERMISSIONS.DELETE_INVITATION + ',' + 
        WORKSPACE_PERMISSIONS.DELETE_MEMBER + ',' +
        WORKSPACE_PERMISSIONS.CREATE_STATUS + ',' + 
        WORKSPACE_PERMISSIONS.READ_STATUS + ',' + 
        WORKSPACE_PERMISSIONS.UPDATE_STATUS + ',' + 
        WORKSPACE_PERMISSIONS.DELETE_STATUS + ',' + 
        WORKSPACE_PERMISSIONS.CREATE_TODO + ',' +
        WORKSPACE_PERMISSIONS.READ_TODO + ',' + 
        WORKSPACE_PERMISSIONS.UPDATE_TODO + ',' +
        WORKSPACE_PERMISSIONS.DELETE_TODO
    })
    await WorkspaceRolesService.createRole({
      workspaceId: result[0].id,
      roleName: WORKSPACE_ROLES.EDITOR,
      permissions: WORKSPACE_PERMISSIONS.READ_WORKSPACE + ',' + 
      WORKSPACE_PERMISSIONS.UPDATE_WORKSPACE + ',' + 
      WORKSPACE_PERMISSIONS.READ_ROLE + ',' + 
      WORKSPACE_PERMISSIONS.CREATE_INVITATION + ',' + 
      WORKSPACE_PERMISSIONS.READ_INVITATION + ',' + 
      WORKSPACE_PERMISSIONS.UPDATE_INVITATION + ',' + 
      WORKSPACE_PERMISSIONS.CREATE_STATUS + ',' + 
      WORKSPACE_PERMISSIONS.READ_STATUS + ',' + 
      WORKSPACE_PERMISSIONS.UPDATE_STATUS + ',' + 
      WORKSPACE_PERMISSIONS.CREATE_TODO + ',' + 
      WORKSPACE_PERMISSIONS.READ_TODO + ',' + 
      WORKSPACE_PERMISSIONS.UPDATE_TODO
    })
    await WorkspaceRolesService.createRole({
      workspaceId: result[0].id,
      roleName: WORKSPACE_ROLES.VIEWER,
      permissions: WORKSPACE_PERMISSIONS.READ_WORKSPACE + ',' + 
      WORKSPACE_PERMISSIONS.READ_ROLE + ',' + 
      WORKSPACE_PERMISSIONS.READ_STATUS + ',' + 
      WORKSPACE_PERMISSIONS.READ_TODO
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

  static async getWorkspaceById(id: string): Promise<Workspace | null> {
    const result = await getWorkspaceById(id)
    if(!result || !result[0]){
      return null
    }
    return result[0]
  }

  static async getWorkspacesByUserId(userId: string): Promise<Workspace[]> {
    return await getWorkspacesByUserId(userId)
  }

  static async deleteWorkspace(id: string): Promise<void> {
    await deleteWorkspaceMemberByWorkspaceId(id)
    await deleteRoleByWorkspaceId(id)
    await deleteInvitationByWorkplaceId(id)
    await deleteWorkspace(id)
  }

  static async updateWorkspace(id: string, name: string): Promise<Workspace[]> {
    return await updateWorkspace(id, name)
  }
}