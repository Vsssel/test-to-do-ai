import { NextRequest, NextResponse } from "next/server";
import { SessionService } from "../../../../lib/services/session.service";
import { generateRefreshToken, generateToken } from "../../../../lib/utils/jwt";
import { cookies } from "next/headers";
import { UserService } from "../../../../lib/services/user.service";

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh access token
 *     description: Uses refresh_token cookie to rotate tokens and set new auth cookies.
 *     responses:
 *       200:
 *         description: Refreshed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Refresh token / user not found
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
    try{
        const refresh_token = request.cookies.get('refresh_token')?.value

        if(!refresh_token){
            return NextResponse.json(
                { error: 'Refresh token not found' },
                { status: 404 }
            )
        }

        const sessions =  await SessionService.findSessionByRefreshToken(refresh_token)

        if(sessions.length === 0 || !sessions[0] || sessions[0].revoked || sessions[0].expiresAt < new Date()){
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 } 
            )
        }

        const user = await UserService.findById(sessions[0].userId)

        if(!user.length || !user[0]){
            return NextResponse.json(
                { error: 'User not found'},
                { status: 404 }
            )
        }

        const new_access_token = generateToken({userId: sessions[0].userId, email: user[0].email})
        const new_refresh_token = generateRefreshToken()
        await SessionService.updateSession(sessions[0].id, false, undefined, new_refresh_token)

        const cookieStore = await cookies()

        cookieStore.set('token', new_access_token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60,
            path: '/'
        })

        cookieStore.set('refresh_token', new_refresh_token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/'
        })

        return NextResponse.json(
            { status: 200 }
        )
    }catch(error){
        if(error instanceof Error){
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { error: error },
            { status: 500 }
        )
    }
}