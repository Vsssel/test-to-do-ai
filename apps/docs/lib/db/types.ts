import { SessionTable, StatusesTable, ToDoTable, UserTable } from '@repo/db'
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

export type { UpdateToDo, User, NewToDo, NewUser, ToDo, Status, Session, NewSession, NewStatus}
