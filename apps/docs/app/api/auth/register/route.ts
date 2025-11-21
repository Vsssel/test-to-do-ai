import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { createdUserSchema } from "../../../../lib/validations/schema";
import { UserService } from "../../../../lib/services/user.service";
import { generateToken } from "../../../../lib/utils/jwt";
import z from 'zod';

export async function POST(request: NextRequest): Promise<NextResponse> {
    try{
        const body = await request.json()
        const validated = createdUserSchema.parse(body)
        const emailExists = await UserService.findByEmail(validated.email)
        if(emailExists.length > 0){
            return NextResponse.json(
                { error: 'Conflict', details: 'User with this email already exists'},
                { status: 409 }
            )
        }

        const result = await UserService.createUser(validated)

        const token = generateToken({
            userId: result.id,
            email: result.email
        })

        const cookieStore = await cookies()
        cookieStore.set('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60,
            path: '/', 
        })

        return NextResponse.json(
            {
                user: {
                    id: result.id,
                    name: result.name,
                    email: result.email
                },
                message: 'Registration successful'
            },
            { status: 201 }
        )
    } catch(error){
        if(error instanceof z.ZodError){
            return NextResponse.json(
                {error: 'Validation Failed', details: error.issues },
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