import { createStatus, deleteStatus, getStatusById, getStatusesByUserId, getStatusByTitle, getStatuses, updateStatus, getStatusesByWorkspaceId } from "../db/queries/status";
import { NewStatus, Status } from "../db/types";
import { CreateStatusInput, UpdateStatusInput } from "../validations/schema";

export class StatusesService {
    static async getStatusesByWorkspaceId(workspaceId: string): Promise<Status[]> {
        return await getStatusesByWorkspaceId(workspaceId)
    }

    static async getStatuses(): Promise<Status[]> {
        return await getStatuses()
    }

    static async getStatusByTitle(title: string): Promise<Status[]> {
        return await getStatusByTitle(title)
    }

    static async getStatusById(id: number): Promise<Status[]> {
        return await getStatusById(id)
    }

    static async getStatusesByUserId(userId: string): Promise<Status[]> {
        return await getStatusesByUserId(userId)
    }

    static async createStatus(status: NewStatus): Promise<Status[]> {
        return await createStatus(status)
    }

    static async updateStatus(status: UpdateStatusInput): Promise<Status[]> {
        return await updateStatus(status)
    }

    static async deleteStatus(id: number): Promise<void> {
        await deleteStatus(id)
    }
}