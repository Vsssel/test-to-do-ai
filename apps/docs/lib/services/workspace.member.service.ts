import { createWorkspaceMember, deleteWorkspaceMember, getWorkspaceMembersByUserId, getWorkspaceMembersByWorkspaceId, updateWorkspaceMemberRole } from "../db/queries/workspaceMember";
import { NewWorkspaceMember, WorkspaceMember } from "../db/types";

export class WorkspaceMemberService {
  static async createWorkspaceMember(data: NewWorkspaceMember): Promise<WorkspaceMember[]> {
    return await createWorkspaceMember(data)
  }

  static async getWorkspaceMembersByWorkspaceId(workspaceId: string): Promise<WorkspaceMember[]> {
    return await getWorkspaceMembersByWorkspaceId(workspaceId)
  }

  static async getWorkspaceMembersByUserId(userId: string): Promise<WorkspaceMember[]> {
    return await getWorkspaceMembersByUserId(userId)
  }

  static async deleteWorkspaceMember(id: string): Promise<void> {
    await deleteWorkspaceMember(id)
  }

  static async updateWorkspaceMemberRole(id: string, roleId: number): Promise<WorkspaceMember[]> {
    return await updateWorkspaceMemberRole(id, roleId)
  }
}