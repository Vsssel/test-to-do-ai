import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "../../../lib/middleware/auth";
import { createStatusSchema, updateStatusSchema } from "../../../lib/validations/schema";
import { StatusesService } from "../../../lib/services/statuses.service";
import z from "zod";
import { WorkspaceMemberService } from "../../../lib/services/workspace.member.service";
import { WorkspaceRolesService } from "../../../lib/services/workspace.roles.service";
import { WORKSPACE_PERMISSIONS } from "../../../lib/values/enums";

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

        if(!user?.userId){
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        data.userId = user?.userId
        const validated = createStatusSchema.parse(data)

        if(!validated.workspaceId && !validated.userId){
            return NextResponse.json(
                { error: 'Workspace Id or User Id is required' },
                { status: 400 }
            )
        }

        if(validated.workspaceId){
            const workspaceMember = await WorkspaceMemberService.getWorkspaceMemberByUserId(user.userId, validated.workspaceId)
            const roles = await WorkspaceRolesService.getRolesByWorkspaceId(validated.workspaceId)
            if(!workspaceMember || workspaceMember.userId !== user.userId || roles.some(role => role.id === workspaceMember.roleId && !role.permissions.includes(WORKSPACE_PERMISSIONS.CREATE_STATUS))){
                return NextResponse.json(
                    { error: 'Forbidden' },
                    { status: 403 }
                )
            }
        }

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
        const { searchParams } = new URL(request.url)
        const workspaceId = searchParams.get('workspaceId')
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

        if(workspaceId){
            const workspaceMember = await WorkspaceMemberService.getWorkspaceMemberByUserId(user.userId, workspaceId)
            const roles = await WorkspaceRolesService.getRolesByWorkspaceId(workspaceId)
            if(!workspaceMember || workspaceMember.userId !== user.userId || roles.some(role => role.id === workspaceMember.roleId && !role.permissions.includes(WORKSPACE_PERMISSIONS.READ_STATUS))){
                return NextResponse.json(
                    { error: 'Forbidden' },
                    { status: 403 }
                )
            }

            const statuses = await StatusesService.getStatusesByWorkspaceId(workspaceId)
            return NextResponse.json(statuses, { status: 200 })
        }else{
            const statuses = await StatusesService.getStatusesByUserId(user.userId)

            return NextResponse.json(statuses, { status: 200 })
        }

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