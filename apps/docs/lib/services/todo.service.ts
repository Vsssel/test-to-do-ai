import { createToDoForUser, deleteTodoForUser, getToDoById, getTodosForUser, updateToDoForUser } from "../db/queries/todos";
import { ToDo } from "../db/types";
import { CreateToDoInput, createToDoSchema, UpdateToDoInput, updateToDoSchema } from "../validations/schema";

export class TodoService {
    static async createToDo(data: CreateToDoInput): Promise<ToDo>{
        const validated = createToDoSchema.parse(data)

        const result = await createToDoForUser(validated);

        if (!result || !result[0]) {
            throw new Error("Failed to create todo");
        }

        return result[0];
    }


    static async updateToDo(data: UpdateToDoInput): Promise<ToDo>{
        const validated = updateToDoSchema.parse(data)

        const result = await updateToDoForUser(validated)

        if(!result || !result[0]){
            throw new Error('Failed to update todo')
        }

        return result[0]
    }


    static async getToDoById(id: string): Promise<ToDo | null>{
        const todo = await getToDoById(id);
        return todo;
    }

    static async getToDosByUserId(userId: string, statusId?: number): Promise<ToDo[]>{
        const result = await getTodosForUser(userId, statusId)

        if(!result || !result[0]){
            throw new Error('Failed to fetch todos')
        }

        return result
    }


    static async deleteTodo(userId: string, todoId: string): Promise<void>{
        await deleteTodoForUser(userId, todoId)
    }
}