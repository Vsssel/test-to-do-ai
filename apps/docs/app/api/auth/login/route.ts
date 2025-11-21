import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "../../../../lib/validations/schema";
import { UserService } from "../../../../lib/services/user.service";
import { generateToken } from "../../../../lib/utils/jwt";
import { cookies } from "next/headers";
import z from "zod";
const bcrypt = require('bcrypt')

export async function POST(request: NextRequest): Promise<NextResponse> {
    try{
        const data = await request.json()
        const validated = loginSchema.parse(data)

        const user = (await UserService.findByEmail(validated.email))[0]
        if(!user){
            return NextResponse.json(
                {error: 'User does not exists'},
                { status: 401 }
            )
        }

        const isValid = await bcrypt.compare(validated.password, user.passwordHash)
        if(!isValid){
            return NextResponse.json(
                { error: 'Wrong password' },
                { status: 401 }
            )
        }

        const token = generateToken({
            userId: user.id,
            email: user.email
        })

        const cookieStore = await cookies()
        cookieStore.set('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60,
            path: '/'
        })

        return NextResponse.json(
            user, {status: 201}
        )
    }catch(error){
        if(error instanceof z.ZodError){
            return NextResponse.json(
                {error: error.issues},
                {status: 400}
            )
        }

        if(error instanceof Error){
            return NextResponse.json(
                {error: error.message},
                {status: 400}
            )
        }

        return NextResponse.json(
            {error: error},
            {status: 400}
        )
    }
}