import { NextRequest, NextResponse } from "next/server";
import { createToDoSchema, updateToDoSchema } from "../../../lib/validations/schema";
import { authenticateRequest } from "../../../lib/middleware/auth";
import { TodoService } from "../../../lib/services/todo.service";
import z from "zod";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try{
        const data = await request.json()
        const authResult = await authenticateRequest(request)

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error.statusText || 'Unauthorized' },
                { status: authResult.error.status || 401 }
            );
        }

        const { user } = authResult;
        if (user?.userId) data.userId = user.userId;
        const validated = createToDoSchema.parse(data)
        const todo = await TodoService.createToDo(validated)

        return NextResponse.json(
            todo, { status: 201}
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
                { error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { error: 'Internal Server error' },
            { status: 500 }
        )

    }
}


export async function PUT(request: NextRequest): Promise<NextResponse>{
    try{
        const data = await request.json()

        const authResult = await authenticateRequest(request)

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error.statusText || 'Unauthorized' },
                { status: authResult.error.status || 401 }
            );
        }

        const { user } = authResult;
        if (user?.userId) data.userId = user.userId;

        const validated = updateToDoSchema.parse(data)
        const result = TodoService.updateToDo(validated)

        return NextResponse.json(
            result, { status: 200 }
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
                { error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { error: 'Internal Server error' },
            { status: 500 }
        )
    }
}

export async function GET(params: NextRequest): Promise<NextResponse> {
    const
}