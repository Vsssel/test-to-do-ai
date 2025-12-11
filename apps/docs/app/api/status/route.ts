import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "../../../lib/middleware/auth";
import { createStatusSchema, updateStatusSchema } from "../../../lib/validations/schema";
import { StatusesService } from "../../../lib/services/statuses.service";
import z from "zod";

export async function POST(request: NextRequest): Promise<NextResponse>{
    try{
        const data = await request.json()
        const authResult = await authenticateRequest(request)

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error.statusText || 'Unauthorized' },
                { status: authResult.error.status || 401 }
            );
        }

        const { user } = authResult

        data.userId = user?.userId
        console.log('Creating status with data:', data);
        const validated = createStatusSchema.parse(data)

        const result = await StatusesService.createStatus(validated)

        if(!result || !result[0]){
            return NextResponse.json(
                { error: 'Failed to create status' },
                { status: 500 }
            )
        }

        return NextResponse.json(
            result, { status: 201 }
        )
    }catch(error){
        if(error instanceof z.ZodError){
            return NextResponse.json(
                { error: 'Validation Error', details: error.issues },
                { status: 400}
            )
        }

        if(error instanceof Error){
            return NextResponse.json(
                { error: 'Internal Server Error', details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { error: error },
            { status: 500 }
        )
    }
}


export async function GET(request: NextRequest): Promise<NextResponse> {
    try{
        const authResult = await authenticateRequest(request)

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error.statusText || 'Unauthorized' },
                { status: authResult.error.status || 401 }
            );
        }

        const { user } = authResult

        if(!user?.userId){
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const statuses = await StatusesService.getStatusesByUserId(user.userId)

        return NextResponse.json(statuses, { status: 200 })
    }catch(error){
        if(error instanceof Error){
            return NextResponse.json(
                { error: 'Internal Server Error', details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { error: error },
            { status: 500 }
        )
    }
}