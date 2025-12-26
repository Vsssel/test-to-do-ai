import { NextRequest, NextResponse } from "next/server";
import { createToDoSchema } from "../../../lib/validations/schema";
import { authenticateRequest } from "../../../lib/middleware/auth";
import { TodoService } from "../../../lib/services/todo.service";
import z from "zod";
import { WorkspaceMemberService } from "../../../lib/services/workspace.member.service";
import { WorkspaceRolesService } from "../../../lib/services/workspace.roles.service";
import { WORKSPACE_PERMISSIONS } from "../../../lib/values";

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
        if(!user?.userId){
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        if (!data.workspaceId) data.userId = user.userId;
        const validated = createToDoSchema.parse(data)

        if(validated.workspaceId){
            const workspaceMember = await WorkspaceMemberService.getWorkspaceMemberByUserId(user?.userId, validated.workspaceId)
            const roles = await WorkspaceRolesService.getRolesByWorkspaceId(validated.workspaceId)
            if(!workspaceMember || workspaceMember.userId !== user?.userId || roles.some(role => role.id === workspaceMember.roleId && !role.permissions.includes(WORKSPACE_PERMISSIONS.CREATE_TODO))){
                return NextResponse.json(
                    { error: 'Forbidden' },
                    { status: 403 }
                )
            }
        }
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

export async function GET(request: NextRequest): Promise<NextResponse>{
    try{
        const authResult = await authenticateRequest(request)
        const searchParams = request.nextUrl.searchParams;
        const statusId = searchParams.get('statusId');
        const workspaceId = searchParams.get('workspaceId');

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

        if(!workspaceId){
            const todos = await TodoService.getToDos(statusId ? parseInt(statusId) : undefined, undefined, user?.userId)
            return NextResponse.json(
                { data: todos.map(todo => ({ id: todo.id, title: todo.title, statusId: todo.statusId })) }, { status: 200 }
            )
        }else{
            const workspaceMember = await WorkspaceMemberService.getWorkspaceMemberByUserId(user?.userId, workspaceId)
            const roles = await WorkspaceRolesService.getRolesByWorkspaceId(workspaceId)
            if(!workspaceMember || workspaceMember.userId !== user?.userId || roles.some(role => role.id === workspaceMember.roleId && !role.permissions.includes(WORKSPACE_PERMISSIONS.READ_TODO))){
                return NextResponse.json(
                    { error: 'Forbidden' },
                    { status: 403 }
                )
            }  
            const todos = await TodoService.getToDos(statusId ? parseInt(statusId) : undefined, workspaceId)
            return NextResponse.json(
                { data: todos.map(todo => ({ id: todo.id, title: todo.title, statusId: todo.statusId })) }, { status: 200 }
            )
        }
        
    }catch(error){
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
