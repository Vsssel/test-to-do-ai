import { createInvitation, deleteInvitationByWorkplaceId, getInvitationsByEmail, getInvitationsById, getInvitationByToken, updateInvitationStatus } from "../db/queries/invitations"
import { Invitation, NewInvitation } from "../db/types"
import { emailQueue } from "../messaging/queue"
import { UserService } from "./user.service"
import { WorkspaceMemberService } from "./workspace.member.service"

export class InvitationsService {
  static async createInvitation(data: NewInvitation): Promise<Invitation[]> {
    try {
    emailQueue.add('email-queue', {
      to: data.email,
      text: 'Test email'
    },
    {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    }
  )

    return await createInvitation(data)
  } catch (error) {
      console.error('Error creating invitation:', error)
      throw error
    }
  }

  static async getInvitationByToken(token: string): Promise<Invitation[]> {
    return await getInvitationByToken(token)
  }

  static async updateInvitationStatus(id: string, status: string, acceptedAt: Date): Promise<void> {
    await updateInvitationStatus(id, status, acceptedAt)
  }

  static async getInvitationsById(workspaceId: string): Promise<Invitation[]> {
    return await getInvitationsById(workspaceId)
  }

  static async getInvitationsByEmail(email: string): Promise<Invitation[]> {
    return await getInvitationsByEmail(email)
  }

  static async deleteInvitation(id: string): Promise<void> {
    await deleteInvitationByWorkplaceId(id)
  }
}