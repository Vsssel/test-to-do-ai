import { NextRequest, NextResponse } from "next/server";
import { createWorkspaceSchema } from "../../../lib/validations/schema";
import { authenticateRequest } from "../../../lib/middleware/auth";
import { WorkspaceService } from "../../../lib/services/workspace.service";
import z from "zod";

/**
 * @swagger
 * /api/workspace:
 *   get:
 *     tags:
 *       - Workspace
 *     summary: List user workspaces
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Workspaces
 *       401:
 *         description: Unauthorized
 *   post:
 *     tags:
 *       - Workspace
 *     summary: Create workspace
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Created workspace
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
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

export async function GET(request: NextRequest): Promise<NextResponse> {
    try{
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

        const result = await WorkspaceService.getWorkspacesByUserId(user?.userId)

        if(!result || !result){
            return NextResponse.json(
                { error: 'Failed to get workspaces' },
                { status: 500 }
            )
        }

        return NextResponse.json(result, { status: 200 })
    }catch(error){
        if(error instanceof z.ZodError){
            return NextResponse.json(
                { error: 'Internal Server Error', details: error.message },
                { status: 500 }
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