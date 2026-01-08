import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/workspace/{id}/invitations%202:
 *   get:
 *     tags:
 *       - Workspace Invitations
 *     summary: Deprecated invitations endpoint (do not use)
 *     description: This route exists due to a folder naming mistake. Use /api/workspace/{id}/invitations instead.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       410:
 *         description: Gone (deprecated)
 */
export async function GET() {
  return NextResponse.json(
    { error: "Deprecated endpoint. Use /api/workspace/{id}/invitations." },
    { status: 410 },
  );
}

