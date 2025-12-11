import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/middleware/auth";
import { updateToDoSchema } from "../../../../lib/validations/schema";
import { TodoService } from "../../../../lib/services/todo.service";
import z from "zod";
import { StatusesService } from "../../../../lib/services/statuses.service";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }>}): Promise<NextResponse>{
    try{
        const { id } =  await context.params;
        const data = await request.json()
        const authResult = await authenticateRequest(request)

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error.statusText || 'Unauthorized' },
                { status: authResult.error.status || 401 }
            );
        }

        const { user } = authResult;
        const props = {
          ...data, 
          id: id,
          userId: user?.userId
        }

        const validated = updateToDoSchema.parse(props)
        const existingToDo = await TodoService.getToDoById(validated.id)

        if(!existingToDo){
            return NextResponse.json(
                { error: 'ToDo not found' },
                { status: 404 }
            )
        }

        if(existingToDo.userId !== user?.userId){
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            )
        }

        const existingStatusForUser = validated.statusId && await StatusesService.getStatusById(validated.statusId)
        if(existingStatusForUser && existingStatusForUser.length > 0){
          const statusExists = existingStatusForUser.some(status => status.userId === user?.userId)
          if(!statusExists){
              return NextResponse.json(
                  { error: 'Status not found for user' },
                  { status: 400 }
              )
          }
        }

        const result = await TodoService.updateToDo(validated)

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

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }>}): Promise<NextResponse>{
    try{
        const { id } =  await context.params;
        const authResult = await authenticateRequest(request)

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error.statusText || 'Unauthorized' },
                { status: authResult.error.status || 401 }
            );
        }

        const { user } = authResult;
        const existingToDo = await TodoService.getToDoById(id)

        if(!existingToDo){
            return NextResponse.json(
                { error: 'ToDo not found' },
                { status: 404 }
            )
        }

        if(existingToDo.userId !== user?.userId){
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            )
        }

        await TodoService.deleteTodo(user.userId, id)

        return NextResponse.json(
            { message: 'ToDo deleted successfully' }, { status: 200 }
        )
    }catch(error){
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

export default async function GET(request: NextRequest, context: { params: Promise<{ id: string }>}): Promise<NextResponse>{
    try{
        const { id } =  await context.params;
        const authResult = await authenticateRequest(request)

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error.statusText || 'Unauthorized' },
                { status: authResult.error.status || 401 }
            );
        }

        const { user } = authResult;
        const todo = await TodoService.getToDoById(id)

        if(!todo){
            return NextResponse.json(
                { error: 'ToDo not found' },
                { status: 404 }
            )
        }

        if(todo.userId !== user?.userId){
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            )
        }

        return NextResponse.json(
            todo, { status: 200 }
        )
    }catch(error){
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