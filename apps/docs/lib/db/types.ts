import { StatusesTable, ToDoTable, UserTable } from '@repo/db'
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

export type { UpdateToDo, User, NewToDo, NewUser, ToDo, Status}
