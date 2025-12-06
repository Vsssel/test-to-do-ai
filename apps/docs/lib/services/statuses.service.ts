import { createStatus, deleteStatus, getStatusById, getStatusByTitle, getStatuses, updateStatus } from "../db/queries/status";
import { NewStatus, Status } from "../db/types";

export class StatusesService {
    static async getStatuses(): Promise<Status[]> {
        return await getStatuses()
    }

    static async getStatusByTitle(title: string): Promise<Status[]> {
        return await getStatusByTitle(title)
    }

    static async getStatusById(id: number): Promise<Status[]> {
        return await getStatusById(id)
    }

    static async createStatus(status: NewStatus): Promise<void> {
        await createStatus(status)
    }

    static async updateStatus(status: Status): Promise<void> {
        await updateStatus(status)
    }

    static async deleteStatus(id: number): Promise<void> {
        await deleteStatus(id)
    }
}