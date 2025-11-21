import { db, ToDoTable, StatusesTable} from '@repo/db'
import { eq, and } from 'drizzle-orm'
import { NewToDo, ToDo, UpdateToDo } from '../types';
import { getStatusById, getStatusByTitle, getStatuses } from './status';
import { EStatuses } from '../constants/statuses';

async function getTodosForUser(userId: string, statusId?: number): Promise<ToDo[]>{
    const conditions = [eq(ToDoTable.userId, userId)];
    
    if (statusId) {
        conditions.push(eq(ToDoTable.statusId, statusId));
    }
    
    return await db
        .select()
        .from(ToDoTable)
        .where(and(...conditions))
}

async function deleteTodoForUser(userId: string, todoId: string){
    return await db
        .delete(ToDoTable)
        .where(and(eq(ToDoTable.userId, userId), eq(ToDoTable.id, todoId)))
}

async function updateToDoForUser(data: UpdateToDo) {    
    return await db 
        .update(ToDoTable)
        .set(data)
        .where(and(eq(ToDoTable.id, data.id), eq(ToDoTable.userId, data.userId)))
        .returning()
}

async function createToDoForUser(data: NewToDo){
    return await db
        .insert(ToDoTable)
        .values(data)
        .returning()
}

export { getTodosForUser, deleteTodoForUser, updateToDoForUser, createToDoForUser}