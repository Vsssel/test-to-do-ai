import { createSession, deleteSession, findSessionByRefreshToken, findSessionByUserId, updateSession } from "../db/queries/session";
import { NewSession, Session } from "../db/types";

export class SessionService {
    static async createSession(session: NewSession): Promise<Session> {
        return await createSession(session)
    }

    static async findSessionByRefreshToken(refreshToken: string): Promise<Session[]> {
        return await findSessionByRefreshToken(refreshToken)
    }

    static async findSessionByUserId(userId: string): Promise<Session> {
        return await findSessionByUserId(userId)
    }

    static async updateSession(id: string, revoked?: boolean, revoked_at?: Date, refresh_token?: string): Promise<void> {
        await updateSession(id, revoked, revoked_at, refresh_token)
    }

    static async deleteSession(id: string): Promise<void> {
        await deleteSession(id)
    }
}