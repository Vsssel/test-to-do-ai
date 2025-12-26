import { db, ToDoTable} from '@repo/db'
import { eq, and } from 'drizzle-orm'
import { NewToDo, ToDo } from '../types';
import { UpdateToDoInput } from '../../validations/schema';

async function getTodos(userId?: string, statusId?: number, workspaceId?: string): Promise<ToDo[]>{
    const conditions = [];
    
    if (statusId) {
        conditions.push(eq(ToDoTable.statusId, statusId));
    }

    if (workspaceId) {
        conditions.push(eq(ToDoTable.workspaceId, workspaceId));
    }

    if(userId) {
        conditions.push(eq(ToDoTable.userId, userId));
    }
    
    return await db
        .select()
        .from(ToDoTable)
        .where(and(...conditions))
}

async function getToDoById(id: string): Promise<ToDo | null>{
    const todo = await db
        .select()
        .from(ToDoTable)
        .where(eq(ToDoTable.id, id))
    
    return todo[0] || null;
}

async function deleteTodo(todoId: string, userId?: string, workspaceId?: string){
    const conditions = [];
    if(userId) {
        conditions.push(eq(ToDoTable.userId, userId));
    }
    if(workspaceId) {
        conditions.push(eq(ToDoTable.workspaceId, workspaceId));
    }
    return await db
        .delete(ToDoTable)
        .where(and(...conditions, eq(ToDoTable.id, todoId)))
}

async function updateToDoById(id: string ,data: UpdateToDoInput) {    
    return await db 
        .update(ToDoTable)
        .set(data)
        .where(and(eq(ToDoTable.id, id)))
        .returning()
}

async function createToDo(data: NewToDo){
    return await db
        .insert(ToDoTable)
        .values(data)
        .returning()
}

export { getTodos, deleteTodo, updateToDoById, createToDo, getToDoById }