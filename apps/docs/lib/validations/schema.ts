import { z } from 'zod'

export const createToDoSchema = z.object({
    userId: z.string().uuid('Invaloid User Id format').optional(),
    workspaceId: z.string().uuid('Invalid Workspace Id format').optional(),
    title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
    content: z.string().optional(),
    statusId: z.number().optional()
})

export const updateToDoSchema = z.object({
    title: z.string().min(1).max(255).optional(),
    content: z.string().min(1).max(255).optional(),
    statusId: z.number().optional()
})

export const createdUserSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
    email: z.string().email('Invalid email format'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(16, 'Password is too long')
        .regex(/[A-Z]/, 'Password should have at least one uppercase letter')
})

export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string()
})

export const createStatusSchema = z.object({
    userId: z.string().uuid('Invaloid User Id format').optional(),
    workspaceId: z.string().uuid('Invalid Workspace Id format').optional(),
    title: z.string().min(1, 'Title is required').max(255, 'Title is too long')
})

export const updateStatusSchema = z.object({
    id: z.number('Invalid status id format'),
    workspaceId: z.string('Invalid workspace id format').optional(),
    title: z.string().min(1, 'Title is required').max(255, 'Title is too long')
})

export const createWorkspaceSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
    ownerId: z.uuid('Invalid User Id format')
})

export const updateWorkspaceSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name is too long')
})

export const createWorkspaceRoleSchema = z.object({
    workspaceId: z.string().uuid('Invalid Workspace Id format'),
    roleName: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
    permissions: z.string().min(1, 'Permissions is required').max(255, 'Permissions is too long')
})

export const updateWorkspaceRoleSchema = z.object({
    id: z.string().uuid('Invalid Role Id format'),
    name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
    permissions: z.string().min(1, 'Permissions is required').max(255, 'Permissions is too long')
})

export const createInvitationSchema = z.object({
    email: z.string().email('Invalid email format'),
    workspaceId: z.string().uuid('Invalid Workspace Id format'),
    roleId: z.number('Invalid Role Id format'),
    token: z.string().min(1, 'Token is required').max(255, 'Token is too long'),
    expiredAt: z.date('Invalid expired at format')
})

export const acceptInvitationSchema = z.object({
    status: z.enum(['accepted', 'rejected']).default('accepted')
})

export type CreateToDoInput = z.infer<typeof createToDoSchema>
export type UpdateToDoInput = z.infer<typeof updateToDoSchema>
export type CreateUserInput = z.infer<typeof createdUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateStatusInput = z.infer<typeof createStatusSchema>
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>
export type CreateWorkspaceRoleInput = z.infer<typeof createWorkspaceRoleSchema>
export type UpdateWorkspaceRoleInput = z.infer<typeof updateWorkspaceRoleSchema>
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>