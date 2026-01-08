import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "../../../../lib/validations/schema";
import { UserService } from "../../../../lib/services/user.service";
import { generateRefreshToken, generateToken } from "../../../../lib/utils/jwt";
import { cookies } from "next/headers";
import z from "zod";
import { SessionService } from "../../../../lib/services/session.service";
const bcrypt = require('bcrypt')

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login
 *     description: Authenticates the user and sets auth cookies (token + refresh_token).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Logged in
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
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

        const refresh_token = generateRefreshToken()

        const cookieStore = await cookies()
        cookieStore.set('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60,
            path: '/'
        })

        cookieStore.set('refresh_token', refresh_token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/'
        })

        const session = await SessionService.createSession({
            userId: user.id,
            refreshToken: refresh_token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
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