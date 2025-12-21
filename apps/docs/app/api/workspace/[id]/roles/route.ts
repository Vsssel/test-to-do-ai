import { NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "../../../../../lib/middleware/auth"
import { WorkspaceRolesService } from "../../../../../lib/services/workspace.roles.service"
import z from "zod"
import { WorkspaceMemberService } from "../../../../../lib/services/workspace.member.service"
import { WORKSPACE_PERMISSIONS } from "../../../../../lib/values"
import { createWorkspaceRoleSchema } from "../../../../../lib/validations/schema"

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
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

        const result = await WorkspaceRolesService.getRolesByWorkspaceId(id)
        if(!result || !result){
            return NextResponse.json(
                { error: 'Failed to get roles' },
                { status: 500 }
            )
        }
        const member = await WorkspaceMemberService.getWorkspaceMemberByUserId(user.userId, id)
        if(member && result.some(r => r.permissions.includes(WORKSPACE_PERMISSIONS.READ_ROLE))){
            return NextResponse.json(result, { status: 200 })
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
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
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

        if(!user){
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }
        
        const member = await WorkspaceMemberService.getWorkspaceMemberByUserId(user.userId, id)
        const roles = await WorkspaceRolesService.getRolesByWorkspaceId(id)

        data.workspaceId = id
        const validated = createWorkspaceRoleSchema.parse(data)
        if(member && roles.some(r => r.permissions.includes(WORKSPACE_PERMISSIONS.CREATE_ROLE))){
            const result = await WorkspaceRolesService.createRole(validated)
            if(!result || !result){
                return NextResponse.json(
                    { error: 'Failed to create role' },
                    { status: 500 }
                )
            }
            return NextResponse.json(result, { status: 201 })
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
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}