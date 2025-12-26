import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/middleware/auth";
import { updateStatusSchema } from "../../../../lib/validations/schema";
import { StatusesService } from "../../../../lib/services/statuses.service";
import z from "zod";
import { WORKSPACE_PERMISSIONS } from "../../../../lib/values";
import { WorkspaceRolesService } from "../../../../lib/services/workspace.roles.service";
import { WorkspaceMemberService } from "../../../../lib/services/workspace.member.service";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try{
        const { id } = await context.params;
        const body = await request.json()
        const authResult = await authenticateRequest(request)

        if('error' in authResult){
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

        const data = { 
          ...body, 
          id: Number(id),
          userId: user?.userId
        }

        const validated = updateStatusSchema.parse(data)
        const existingStatus = await StatusesService.getStatusById(validated.id)
        if(!existingStatus || !existingStatus[0]){
            return NextResponse.json(
                { error: 'Status not found' },
                { status: 404 }
            )
        }

        if(existingStatus[0].userId !== user?.userId && existingStatus[0].workspaceId !== validated.workspaceId){
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            )
        }

        if(validated.workspaceId){
            const workspaceMember = await WorkspaceMemberService.getWorkspaceMemberByUserId(user?.userId, validated.workspaceId)
            const roles = await WorkspaceRolesService.getRolesByWorkspaceId(validated.workspaceId)
            if(!workspaceMember || workspaceMember.userId !== user?.userId || roles.some(role => role.id === workspaceMember.roleId && !role.permissions.includes(WORKSPACE_PERMISSIONS.UPDATE_STATUS))){
                return NextResponse.json(
                    { error: 'Forbidden' },
                    { status: 403 }
                )
            }
        }

        const result = await StatusesService.updateStatus(validated)

        if(!result || !result[0]){
            return NextResponse.json(
                { error: 'Failed to create status' },
                { status: 501 }
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