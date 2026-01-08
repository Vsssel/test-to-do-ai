import { NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "../../../../../lib/middleware/auth"
import { WORKSPACE_PERMISSIONS } from "../../../../../lib/values"
import { WorkspaceMemberService } from "../../../../../lib/services/workspace.member.service"
import { WorkspaceRolesService } from "../../../../../lib/services/workspace.roles.service"
import { InvitationsService } from "../../../../../lib/services/invitations.service"
import { acceptInvitationSchema, createInvitationSchema } from "../../../../../lib/validations/schema"
import z from "zod"

/**
 * @swagger
 * /api/workspace/{id}/invitations:
 *   post:
 *     tags:
 *       - Workspace Invitations
 *     summary: Create invitation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               roleId:
 *                 type: integer
 *             required:
 *               - email
 *               - roleId
 *     responses:
 *       201:
 *         description: Created invitation
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   get:
 *     tags:
 *       - Workspace Invitations
 *     summary: Get invitation by token
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invitation
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found / expired / already used
 *   put:
 *     tags:
 *       - Workspace Invitations
 *     summary: Accept invitation (by token)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [accepted, declined]
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Invitation accepted
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found / expired / already used
 */
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

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try{
      const { id } = await context.params
      const searchParams = request.nextUrl.searchParams;
      const token = searchParams.get('token');
      const authResult = await authenticateRequest(request)
      if ('error' in authResult) {
          return NextResponse.json(
              { error: authResult.error.statusText || 'Unauthorized' },
              { status: authResult.error.status || 401 }
          )
      }

      if(!token){
        return NextResponse.json(
          { error: 'Token not found' },
          { status: 404 }
        )
      }

      const { user } = authResult

      if(!user){
          return NextResponse.json(
              { error: 'Unauthorized' },
              { status: 401 }
          )
      }

      const invitation = await InvitationsService.getInvitationByToken(token)
      if(!invitation.length || !invitation[0]){
          return NextResponse.json(
              { error: 'Invitation not found' },
              { status: 404 }
          )
      }
      
      if(invitation[0].email !== user.email){
          return NextResponse.json(
              { error: 'Invitation not found' },
              { status: 404 }
          )
      }
      
      if(invitation[0].status !== 'pending'){
          return NextResponse.json(
              { error: 'Invitation already used' },
              { status: 404 }
          )
      }
      
      if(invitation[0].expiredAt < new Date()){
          return NextResponse.json(
              { error: 'Invitation expired' },
              { status: 404 }
          )
      }
      
      return NextResponse.json(
          { status: 200, invitation: invitation[0] }
      )
  }catch(error){
      if(error instanceof Error){
          return NextResponse.json({ error: error.message }, { status: 500 })
      }

      if(error instanceof z.ZodError){
          return NextResponse.json({ error: error.issues }, { status: 400 })
      }

      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try{
      const { id } = await context.params
      const searchParams = request.nextUrl.searchParams;
      const token = searchParams.get('token');
      const data = await request.json()
      const authResult = await authenticateRequest(request)
      if ('error' in authResult) {
          return NextResponse.json(
              { error: authResult.error.statusText || 'Unauthorized' },
              { status: authResult.error.status || 401 }
          )
      }

      if(!token){
        return NextResponse.json(
          { error: 'Token not found' },
          { status: 404 }
        )
      }

      const { user } = authResult

      if(!user){
          return NextResponse.json(
              { error: 'Unauthorized' },
              { status: 401 }
          )
      }
      
      const invitation = await InvitationsService.getInvitationByToken(token)
      if(!invitation.length || !invitation[0]){
          return NextResponse.json(
              { error: 'Invitation not found' },
              { status: 404 }
          )
      }
      
      if(invitation[0].email !== user.email){
          return NextResponse.json(
              { error: 'Invitation not found' },
              { status: 404 }
          )
      }
      
      if(invitation[0].status !== 'pending'){
          return NextResponse.json(
              { error: 'Invitation already used' },
              { status: 404 }
          )
      }
      
      if(invitation[0].expiredAt < new Date()){
          return NextResponse.json(
              { error: 'Invitation expired' },
              { status: 404 }
          )
      }

      const validated = acceptInvitationSchema.parse(data)

      await InvitationsService.updateInvitationStatus(invitation[0].id, validated.status, new Date())
  
      await WorkspaceMemberService.createWorkspaceMember({
        workspaceId: invitation[0].workspaceId,
        userId: user.userId,
        roleId: invitation[0].roleId
      })
      
      return NextResponse.json(
          { status: 200, message: 'Invitation accepted' }
      )
  }
  catch(error){
      if(error instanceof Error){
          return NextResponse.json({ error: error.message }, { status: 500 })
      }

      if(error instanceof z.ZodError){
          return NextResponse.json({ error: error.issues }, { status: 400 })
      }

      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}