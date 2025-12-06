import { createUser, findUserByEmail, findUserById } from "../db/queries/users";
import { createdUserSchema, CreateUserInput } from "../validations/schema";
import { User } from "../db/types";
const bcrypt = require('bcrypt');

export class UserService {
    static async createUser(data: CreateUserInput): Promise<User>{
        const validated = createdUserSchema.parse(data)
        const hash = await bcrypt.hash(validated.password, 10)
        const result = await createUser({name: validated.name, email: validated.email, passwordHash: hash})
        
        if (!result || !result[0]) {
            throw new Error("Failed to create user");
        }

        return result[0];
    }

    static async findByEmail(email: string): Promise<User[]>{
        const result = await findUserByEmail(email)

        return result
    }

    static async findById(id: string): Promise<User[]>{
        return await findUserById(id)
    }
}