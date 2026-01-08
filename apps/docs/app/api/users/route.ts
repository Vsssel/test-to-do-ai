import { NextRequest, NextResponse } from "next/server";
import { createdUserSchema } from "../../../lib/validations/schema";
import { UserService } from "../../../lib/services/user.service";
import z from "zod";

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create user
 *     description: Creates a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Created user
 *       400:
 *         description: Validation error
 */
export async function POST(request: NextRequest) {
    try{
        const body = await request.json()
        const validated = createdUserSchema.parse(body)
        const user = await UserService.createUser(validated)
        return NextResponse.json(user, {status: 201})
    }catch(error){
        if(error instanceof z.ZodError){
            return NextResponse.json(
                {error: 'Validation Failed', details: error.cause },
                {status: 400}
            )
        }

        if(error instanceof Error){
            return NextResponse.json(
                { error: error.message },
                { status: 500 } 
            )
        }

        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 } 
        )
    }
} 