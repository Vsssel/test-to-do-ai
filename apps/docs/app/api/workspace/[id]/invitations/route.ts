import { NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "../../../../../lib/middleware/auth"
import { WORKSPACE_PERMISSIONS } from "../../../../../lib/values"
import { WorkspaceMemberService } from "../../../../../lib/services/workspace.member.service"
import { WorkspaceRolesService } from "../../../../../lib/services/workspace.roles.service"
import { InvitationsService } from "../../../../../lib/services/invitations.service"
import { createInvitationSchema } from "../../../../../lib/validations/schema"
import z from "zod"

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
    const role =  await WorkspaceRolesService.getRoleById(member.roleId)

    if(!role || !role[0]?.permissions.includes(WORKSPACE_PERMISSIONS.CREATE_INVITATION)){
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    data.workspaceId = id
    const validated = createInvitationSchema.parse(data)
    
    const invitation = await InvitationsService.createInvitation(validated)
    
    return NextResponse.json({ invitation }, { status: 201 })
  }catch (error) {
    if(error instanceof Error){
      return NextResponse.json(
        { error: error.message || 'Internal Server Error' },
        { status: 500 }
      )
    }

    if(error instanceof z.ZodError){
      return NextResponse.json(
        { error: error.name, details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal Server Error', details: error },
      { status: 500 }
    )
  }
    
}