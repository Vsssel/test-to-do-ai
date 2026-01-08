import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "../../../../../../lib/middleware/auth";
import { WorkspaceRolesService } from "../../../../../../lib/services/workspace.roles.service";
import z from "zod";
import { WorkspaceMemberService } from "../../../../../../lib/services/workspace.member.service";
import { WORKSPACE_PERMISSIONS, WORKSPACE_ROLES } from "../../../../../../lib/values";

/**
 * @swagger
 * /api/workspace/{id}/roles/{roleId}:
 *   put:
 *     tags:
 *       - Workspace Roles
 *     summary: Update workspace role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleName:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Updated role
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *   delete:
 *     tags:
 *       - Workspace Roles
 *     summary: Delete workspace role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted role
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string; roleId: string }> }
): Promise<NextResponse> {
    try{
        const { id: workspaceId, roleId } = await context.params
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

        const member = await WorkspaceMemberService.getWorkspaceMemberByUserId(user.userId, workspaceId)
        const roles = await WorkspaceRolesService.getRolesByWorkspaceId(workspaceId)

        if(!member){
            return NextResponse.json(
                { error: 'Workspace member not found' },
                { status: 404 }
            )
        }

        if(roles.some(r => r.id === member.roleId && r.permissions.includes(WORKSPACE_PERMISSIONS.UPDATE_ROLE))){
            const result = await WorkspaceRolesService.updateRole(Number(roleId), data)
            if(!result || !result[0]){
                return NextResponse.json(
                    { error: 'Failed to update role' },
                    { status: 500 }
                )
            }
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
            { error: error },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string; roleId: string }> }
): Promise<NextResponse> {
    try{
        const { id: workspaceId, roleId } = await context.params
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

        const member = await WorkspaceMemberService.getWorkspaceMemberByUserId(user.userId, workspaceId)
        const roles = await WorkspaceRolesService.getRolesByWorkspaceId(workspaceId)

        if(!member){
            return NextResponse.json(
                { error: 'Workspace member not found' },
                { status: 404 }
            )
        }

        if(roles.some(r => r.id === member.roleId && r.permissions.includes(WORKSPACE_PERMISSIONS.DELETE_ROLE))){
            const deletingRole = await WorkspaceRolesService.getRoleById(Number(roleId))
            if(deletingRole[0]?.roleName === WORKSPACE_ROLES.OWNER){
                return NextResponse.json(
                    { error: 'Cannot delete owner role' },
                    { status: 403 }
                )
            }
            await WorkspaceRolesService.deleteRole(Number(roleId))
            return NextResponse.json(
                { message: 'Role deleted successfully' },
                { status: 200 }
            )
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