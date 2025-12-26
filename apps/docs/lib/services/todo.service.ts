import { createToDo, deleteTodo, getToDoById, getTodos, updateToDoById  } from "../db/queries/todos";
import { ToDo } from "../db/types";
import { CreateToDoInput, createToDoSchema, UpdateToDoInput, updateToDoSchema } from "../validations/schema";

export class TodoService {
    static async createToDo(data: CreateToDoInput): Promise<ToDo>{
        const validated = createToDoSchema.parse(data)

        const result = await createToDo(validated);

        if (!result || !result[0]) {
            throw new Error("Failed to create todo");
        }

        return result[0];
    }


    static async updateToDo(id: string, data: UpdateToDoInput): Promise<ToDo>{
        const validated = updateToDoSchema.parse(data)

        const result = await updateToDoById(id, validated)

        if(!result || !result[0]){
            throw new Error('Failed to update todo')
        }

        return result[0]
    }


    static async getToDoById(id: string): Promise<ToDo | null>{
        const todo = await getToDoById(id);
        return todo;
    }

    static async getToDos(statusId?: number, workspaceId?: string, userId?: string): Promise<ToDo[]>{
        return await getTodos(userId, statusId, workspaceId)
    }


    static async deleteTodo(todoId: string, userId?: string, workspaceId?: string): Promise<void>{
        await deleteTodo(todoId, userId, workspaceId)
    }
}