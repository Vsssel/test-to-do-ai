import { db, InvitationsTable } from "@repo/db"
import { Invitation, NewInvitation } from "../types"
import { eq } from "drizzle-orm"

async function createInvitation(data: NewInvitation): Promise<Invitation[]> {
  return await db
    .insert(InvitationsTable)
    .values(data)
    .returning()
}

async function getInvitationByToken(token: string): Promise<Invitation[]> {
  return await db
    .select()
    .from(InvitationsTable)
    .where(eq(InvitationsTable.token, token))
}

async function updateInvitationStatus(id: string, status: string, acceptedAt: Date): Promise<void> {
  await db.update(InvitationsTable).set({ status: status, acceptedAt: acceptedAt }).where(eq(InvitationsTable.id, id)).returning()
}

async function getInvitationsById(workspaceId: string): Promise<Invitation[]> {
  return await db
    .select()
    .from(InvitationsTable)
    .where(eq(InvitationsTable.workspaceId, workspaceId))
}

async function getInvitationsByEmail(email: string): Promise<Invitation[]> {
  return await db
    .select()
    .from(InvitationsTable)
    .where(eq(InvitationsTable.email, email))
}

async function deleteInvitationByWorkplaceId(id: string): Promise<void> {
  await db.delete(InvitationsTable).where(eq(InvitationsTable.workspaceId, id)).returning()
}

export { createInvitation, getInvitationsById, getInvitationsByEmail, deleteInvitationByWorkplaceId, getInvitationByToken, updateInvitationStatus }