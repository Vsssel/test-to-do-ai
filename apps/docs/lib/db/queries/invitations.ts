import { db, InvitationsTable } from "@repo/db"
import { Invitation, NewInvitation } from "../types"
import { eq } from "drizzle-orm"

async function createInvitation(data: NewInvitation): Promise<Invitation[]> {
  return await db
    .insert(InvitationsTable)
    .values(data)
    .returning()
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

async function updateInvitationStatus(id: string, status: string, updatedAt: Date): Promise<Invitation[]> {
  return await db
    .update(InvitationsTable)
    .set({status, updatedAt})
    .where(eq(InvitationsTable.id, id))
    .returning()
}

export { createInvitation, getInvitationsById, getInvitationsByEmail, updateInvitationStatus }