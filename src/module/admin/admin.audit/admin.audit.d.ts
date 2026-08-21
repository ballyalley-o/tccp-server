import type { Types } from 'mongoose'

declare global {
    interface IAdminAudit {
        createdBy ?: Types.ObjectId | null
        updatedBy ?: Types.ObjectId | null
        archivedBy?: Types.ObjectId | null
        archivedAt?: Date | null
    }
}

export {}