import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/middleware/auth";
import { updateToDoSchema } from "../../../../lib/validations/schema";
import { TodoService } from "../../../../lib/services/todo.service";
import z from "zod";
import { StatusesService } from "../../../../lib/services/statuses.service";
import { WorkspaceMemberService } from "../../../../lib/services/workspace.member.service";
import { WorkspaceRolesService } from "../../../../lib/services/workspace.roles.service";
import { WORKSPACE_PERMISSIONS } from "../../../../lib/values";

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
        if(!user?.userId){
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }
        const props = {
          ...data, 
          id: id
        }

        const validated = updateToDoSchema.parse(props)
        const existingToDo = await TodoService.getToDoById(id)

        if(!existingToDo){
            return NextResponse.json(
                { error: 'ToDo not found' },
                { status: 404 }
            )
        }

        if(existingToDo.workspaceId){
            if(existingToDo.workspaceId !== data.workspaceId){
                return NextResponse.json(
                    { error: 'Forbidden' },
                    { status: 403 }
                )
            }
            const workspaceMember = await WorkspaceMemberService.getWorkspaceMemberByUserId(user?.userId, existingToDo.workspaceId)
            if(!workspaceMember){
                return NextResponse.json(
                    { error: 'Forbidden' },
                    { status: 403 }
                )
            }
            const roles = await WorkspaceRolesService.getRolesByWorkspaceId(existingToDo.workspaceId)
            if(!roles.some(role => role.id === workspaceMember.roleId && !role.permissions.includes(WORKSPACE_PERMISSIONS.UPDATE_TODO))){
                return NextResponse.json(
                    { error: 'Forbidden' },
                    { status: 403 }
                )
            }


        }
        if(existingToDo.userId && existingToDo.userId !== user?.userId){
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            )
        }

        const existingStatus = validated.statusId && await StatusesService.getStatusById(validated.statusId)
        if(existingStatus && existingStatus.length > 0){
          const statusExists = existingStatus.some(status => (status.userId === user?.userId || status.workspaceId === existingToDo.workspaceId))
          if(!statusExists){
              return NextResponse.json(
                  { error: 'Status not found for user or workspace' },
                  { status: 400 }
              )
          }
        }else{
            return NextResponse.json(
                { error: 'Status not found' },
                { status: 400 }
            )
        }

        const result = await TodoService.updateToDo(id, validated)

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
                { error: error.message, details: error.cause },
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
        if(!user?.userId){
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }
        const existingToDo = await TodoService.getToDoById(id)

        if(!existingToDo){
            return NextResponse.json(
                { error: 'ToDo not found' },
                { status: 404 }
            )
        }

        if(existingToDo.workspaceId){
            const workspaceMember = await WorkspaceMemberService.getWorkspaceMemberByUserId(user?.userId, existingToDo.workspaceId)
            if(!workspaceMember){
                    return NextResponse.json(
                    { error: 'Forbidden' },
                    { status: 403 }
                )
            }
            const roles = await WorkspaceRolesService.getRolesByWorkspaceId(existingToDo.workspaceId)
            if(!roles.some(role => role.id === workspaceMember.roleId && !role.permissions.includes(WORKSPACE_PERMISSIONS.DELETE_TODO))){
                return NextResponse.json(
                    { error: 'Forbidden' },
                    { status: 403 }
                )
            }
        }

        if(existingToDo.userId && existingToDo.userId !== user?.userId){
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            )
        }

        await TodoService.deleteTodo(id, user?.userId, existingToDo.workspaceId ? existingToDo.workspaceId : undefined)

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

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }>}): Promise<NextResponse>{
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

        if(todo.workspaceId){
            const workspaceMember = await WorkspaceMemberService.getWorkspaceMemberByUserId(user?.userId, todo.workspaceId)
            if(!workspaceMember){
                return NextResponse.json(
                    { error: 'Forbidden' },
                    { status: 403 }
                )
            }
            const roles = await WorkspaceRolesService.getRolesByWorkspaceId(todo.workspaceId)
            if(!roles.some(role => role.id === workspaceMember.roleId && !role.permissions.includes(WORKSPACE_PERMISSIONS.READ_TODO))){
                return NextResponse.json(
                    { error: 'Forbidden' },
                    { status: 403 }
                )
            }
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