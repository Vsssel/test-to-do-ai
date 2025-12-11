import { NextRequest, NextResponse } from "next/server"
import { WorkspaceService } from "../../../../lib/services/workspace.service"
import { authenticateRequest } from "../../../../lib/middleware/auth"
import { WorkspaceMemberService } from "../../../../lib/services/workspace.member.service"
import z from "zod"
import { updateWorkspaceSchema } from "../../../../lib/validations/schema"

export async function GET(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try{
        const { id } = params
        const authResult = await authenticateRequest(request)

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error.statusText || 'Unauthorized' },
                { status: authResult.error.status || 401 }
            )
        }

        const { user } = authResult

        const result = await WorkspaceService.getWorkspaceById(id)

        if(!result || !result[0]){
            return NextResponse.json(
                { error: 'Workspace not found' },
                { status: 404 }
            )
        }

        const member = await WorkspaceMemberService.getWorkspaceMembersByWorkspaceId(result[0].id)

        if(member.some(m => m.userId === user?.userId)){
            return NextResponse.json(member, { status: 200 })
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try{
        const { id } = params
        const data = await request.json()
        const authResult = await authenticateRequest(request)

        if ('error' in authResult) {
            return NextResponse.json(
                { error: authResult.error.statusText || 'Unauthorized' },
                { status: authResult.error.status || 401 }
            )
        }

        const { user } = authResult
        const result = await WorkspaceService.getWorkspaceById(id)

        if(!result || !result[0]){
            return NextResponse.json(
                { error: 'Workspace not found' },
                { status: 404 }
            )
        }
        
        if(result[0].ownerId !== user?.userId){
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            )
        }

        const validated = updateWorkspaceSchema.parse(data)

        const updatedWorkspace = await WorkspaceService.updateWorkspace(id, validated.name)

        if(!updatedWorkspace || !updatedWorkspace[0]){
            return NextResponse.json(
                { error: 'Failed to update workspace' },
                { status: 500 }
            )
        }

        return NextResponse.json(updatedWorkspace, { status: 200 })
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