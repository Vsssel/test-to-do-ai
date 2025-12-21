import { createWorkspaceMember, deleteWorkspaceMember, getWorkspaceMemberByUserId, getWorkspaceMembersById, getWorkspaceMembersByWorkspaceId, updateWorkspaceMemberRole } from "../db/queries/workspaceMember";
import { NewWorkspaceMember, WorkspaceMember } from "../db/types";

export class WorkspaceMemberService {
  static async createWorkspaceMember(data: NewWorkspaceMember): Promise<WorkspaceMember[]> {
    return await createWorkspaceMember(data)
  }

  static async getWorkspaceMembersByWorkspaceId(workspaceId: string): Promise<WorkspaceMember[]> {
    return await getWorkspaceMembersByWorkspaceId(workspaceId)
  }

  static async getWorkspaceMemberByUserId(userId: string, workspaceId: string): Promise<WorkspaceMember> {
    const result = await getWorkspaceMemberByUserId(userId, workspaceId)
    if(!result || !result[0]){
      throw new Error('Workspace member not found')
    }
    return result[0]
  }

  static async getWorkspaceMembersById(id: string): Promise<WorkspaceMember[]> {
    return await getWorkspaceMembersById(id)
  }

  static async deleteWorkspaceMember(id: string): Promise<void> {
    await deleteWorkspaceMember(id)
  }

  static async updateWorkspaceMemberRole(id: string, roleId: number): Promise<WorkspaceMember[]> {
    return await updateWorkspaceMemberRole(id, roleId)
  }
}