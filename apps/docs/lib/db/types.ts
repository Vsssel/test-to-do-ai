import { InvitationsTable, SessionTable, StatusesTable, ToDoTable, UserTable, WorkspaceMembersTable, WorkSpaceRolesTable, WorkspacesTable } from '@repo/db'
import { InferSelectModel, InferInsertModel } from 'drizzle-orm'

type User = InferSelectModel<typeof UserTable>
type NewUser = InferInsertModel<typeof UserTable>
type UpdateToDo = {
    id: string,
    userId: string
} & Partial<Omit<InferInsertModel<typeof ToDoTable>, "id" | "userId">>
type NewToDo = InferInsertModel<typeof ToDoTable>
type ToDo = InferSelectModel<typeof ToDoTable>
type Status = InferSelectModel<typeof StatusesTable>
type NewStatus = InferInsertModel<typeof StatusesTable>
type Session = InferSelectModel<typeof SessionTable>
type NewSession = InferInsertModel<typeof SessionTable>
type NewWorkspace = InferInsertModel<typeof WorkspacesTable>
type Workspace = InferSelectModel<typeof WorkspacesTable>
type NewWorkspaceMember = InferInsertModel<typeof WorkspaceMembersTable>
type WorkspaceMember = InferSelectModel<typeof WorkspaceMembersTable>
type WorkSpaceRoles = InferSelectModel<typeof WorkSpaceRolesTable>
type NewWorkSpaceRoles = InferInsertModel<typeof WorkSpaceRolesTable>
type NewInvitation = InferInsertModel<typeof InvitationsTable>
type Invitation = InferSelectModel<typeof InvitationsTable>
type NewRole = InferInsertModel<typeof WorkSpaceRolesTable>
type Role = InferSelectModel<typeof WorkSpaceRolesTable>

export type { UpdateToDo, User, NewToDo, NewUser, ToDo, Status, Session, NewSession, NewStatus, NewWorkspace, Workspace, NewWorkspaceMember, WorkspaceMember, WorkSpaceRoles, NewWorkSpaceRoles, NewInvitation, Invitation, NewRole, Role }
