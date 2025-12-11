import { NextRequest, NextResponse } from "next/server";
import { createWorkspaceSchema } from "../../../lib/validations/schema";
import { authenticateRequest } from "../../../lib/middleware/auth";
import { WorkspaceService } from "../../../lib/services/workspace.service";
import z from "zod";
import { WorkspaceMemberService } from "../../../lib/services/workspace.member.service";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try{
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
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }
        data.ownerId = user?.userId

        const validated = createWorkspaceSchema.parse(data)

        const result = await WorkspaceService.createWorkspace(validated)

        if(!result || !result[0]){
            return NextResponse.json(
                { error: 'Failed to create workspace' },
                { status: 500 }
            )
        }

        const member = await WorkspaceMemberService.createWorkspaceMember({
            workspaceId: result[0].id,
            userId: user?.userId,
            roleId: 1
        })

        if(!member || !member[0]){
            return NextResponse.json(
                { error: 'Failed to create workspace member' },
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