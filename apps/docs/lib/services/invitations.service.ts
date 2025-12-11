import { createInvitation, getInvitationsByEmail, getInvitationsById, updateInvitationStatus } from "../db/queries/invitations"
import { Invitation, NewInvitation } from "../db/types"
import { emailQueue } from "../messaging/queue"

export class InvitationsService {
  static async createInvitation(data: NewInvitation): Promise<Invitation[]> {
    emailQueue.add('email-queue', {
      to: data.email,
      subject: 'Invitation to join workspace',
      html: `<p>You are invited to join workspace ${data.workspaceId}</p>`
    })
    return await createInvitation(data)
  }

  static async getInvitationsById(workspaceId: string): Promise<Invitation[]> {
    return await getInvitationsById(workspaceId)
  }

  static async getInvitationsByEmail(email: string): Promise<Invitation[]> {
    return await getInvitationsByEmail(email)
  }

  static async updateInvitationStatus(id: string, status: string, updatedAt: Date): Promise<Invitation[]> {
    return await updateInvitationStatus(id, status, updatedAt)
  }
}