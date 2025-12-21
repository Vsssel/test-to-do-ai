import { NextRequest, NextResponse } from "next/server"
import { WorkspaceService } from "../../../../lib/services/workspace.service"
import { authenticateRequest } from "../../../../lib/middleware/auth"
import { WorkspaceMemberService } from "../../../../lib/services/workspace.member.service"
import z from "zod"
import { updateWorkspaceSchema } from "../../../../lib/validations/schema"
import { WorkspaceRolesService } from "../../../../lib/services/workspace.roles.service"
import { WORKSPACE_PERMISSIONS } from "../../../../lib/values"

export async function GET(request: NextRequest, context: { params: { id: string } }): Promise<NextResponse> {
    try{
        const { id } = await context.params
        const authResult = await authenticateRequest(request)

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error.statusText || 'Unauthorized' },
                { status: authResult.error.status || 401 }
            )
        }

        const { user } = authResult

        if(!user){
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        const result = await WorkspaceService.getWorkspaceById(id)

        if(!result || !result){
            return NextResponse.json(
                { error: 'Workspace not found' },
                { status: 404 }
            )
        }

        const member = await WorkspaceMemberService.getWorkspaceMemberByUserId(user.userId, id)
        const roles = await WorkspaceRolesService.getRolesByWorkspaceId(result.id)
        if(member && roles.some(r => r.permissions.includes(WORKSPACE_PERMISSIONS.READ_WORKSPACE))){
            return NextResponse.json(result, { status: 200 })
        }

        return NextResponse.json(
            { error: 'Workspace member not found' },
            { status: 404 }
        )
    }catch(error){
        if(error instanceof z.ZodError){
            return NextResponse.json(
                { error: 'Validation Error', details: error.issues },
                { status: 400 }
            )
        }

        if(error instanceof Error){
            return NextResponse.json(
                { error: 'Internal Server Error', details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { error: 'Internal Server Error', details: error instanceof Error ? error.message : error },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }): Promise<NextResponse> {
    try{
        const { id } = await context.params
        const data = await request.json()
        const authResult = await authenticateRequest(request)

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error.statusText || 'Unauthorized' },
                { status: authResult.error.status || 401 }
            )
        }

        const { user } = authResult

        if(!user?.userId){
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        const result = await WorkspaceService.getWorkspaceById(id)

        if(!result){
            return NextResponse.json(
                { error: 'Workspace not found' },
                { status: 404 }
            )
        }

        const member = await WorkspaceMemberService.getWorkspaceMembersByWorkspaceId(id)
        const roles = await WorkspaceRolesService.getRolesByWorkspaceId(result.id)
        if(member && roles.some(r => r.permissions.includes(WORKSPACE_PERMISSIONS.UPDATE_WORKSPACE))){
            const validated = updateWorkspaceSchema.parse(data)
            const updatedWorkspace = await WorkspaceService.updateWorkspace(id, validated.name)

            if(!updatedWorkspace || !updatedWorkspace[0]){
                return NextResponse.json(
                    { error: 'Failed to update workspace' },
                    { status: 500 }
                )
            }

            return NextResponse.json(updatedWorkspace, { status: 200 })
        }   

        return NextResponse.json(
            { error: 'Forbidden' },
            { status: 403 }
        )
    }catch(error){
        if(error instanceof z.ZodError){
            return NextResponse.json(
                { error: 'Validation Error', details: error.issues },
                { status: 400 }
            )
        }

        if(error instanceof Error){
            return NextResponse.json(
                { error: 'Internal Server Error', details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { error: 'Internal Server Error', details: error instanceof Error ? error.message : error },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try{
        const { id } = await context.params
        const authResult = await authenticateRequest(request)

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error.statusText || 'Unauthorized' },
                { status: authResult.error.status || 401 }
            )
        }

        const { user } = authResult

        if(!user?.userId){
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }
        
        const result = await WorkspaceService.getWorkspaceById(id)

        if(!result){
            return NextResponse.json(
                { error: 'Workspace not found' },
                { status: 404 }
            )
        }

        const member = await WorkspaceMemberService.getWorkspaceMemberByUserId(user.userId, id)
        const roles = await WorkspaceRolesService.getRolesByWorkspaceId(result.id)
        if(member && roles.some(r => r.permissions.includes(WORKSPACE_PERMISSIONS.DELETE_WORKSPACE))){
            await WorkspaceService.deleteWorkspace(id)
            return NextResponse.json({ message: 'Workspace deleted successfully' }, { status: 200 })
        }

        return NextResponse.json(
            { error: 'Forbidden' },
            { status: 403 }
        )

    }catch(error){
        if(error instanceof z.ZodError){
            return NextResponse.json(
                { error: 'Validation Error', details: error.issues },
                { status: 400 }
            )
        }

        if(error instanceof Error){
            return NextResponse.json(
                { error: 'Internal Server Error', details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { error: 'Internal Server Error', details: error instanceof Error ? error.message : error },
            { status: 500 }
        )
    }
}