import { NextRequest, NextResponse } from "next/server";
import { SessionService } from "../../../../lib/services/session.service";
import { cookies } from "next/headers";

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout
 *     description: Revokes the current refresh token session (from cookie) and clears auth cookies.
 *     responses:
 *       200:
 *         description: Logged out
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Refresh token not found
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

        const session = await SessionService.findSessionByRefreshToken(refresh_token)

        if(!session.length || !session[0] || session[0].revoked){
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }
        
        await SessionService.updateSession(session[0].id, true, new Date())

        const cookieStore = await cookies()
        cookieStore.delete('token')
        cookieStore.delete('refresh_token')

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
            {error: error},
            {status: 400}
        )
    }
} 