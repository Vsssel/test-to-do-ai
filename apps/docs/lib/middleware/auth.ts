import { NextRequest } from "next/server";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends NextRequest {
    user?:{
        userId: string,
        email: string
    }
}

export async function authenticateRequest(request: NextRequest): Promise<{user: AuthRequest['user']} | {error: Response}>{
    const token = request.cookies.get('token')?.value

    if(!token){
        return {
            error: new Response(
                JSON.stringify({error: 'Unauthorized'}),
                {status: 401}
            )
        }
    }

    try{
        const decode = verifyToken(token)

        return {
            user: {
                userId: decode.userId,
                email: decode.email
            }
        }
    }catch(error){
        return{
            error: new Response(
                JSON.stringify({ error: 'Invalid token '}),
                { status: 401 }
            )
        }
    }
}