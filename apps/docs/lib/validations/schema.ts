import { z } from 'zod'

export const createToDoSchema = z.object({
    userId: z.string().uuid('Invaloid User Id format'),
    title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
    content: z.string().optional(),
    statusId: z.number().optional()
})

export const updateToDoSchema = z.object({
    id: z.string().uuid('Invalid ToDo Od format'),
    userId: z.string().uuid('Invaloid User Id format'),
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
        .regex(/[A-Z]/, 'Password should have at least one uppercase letter')
})

export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string()

})

export type CreateToDoInput = z.infer<typeof createToDoSchema>
export type UpdateToDoInput = z.infer<typeof updateToDoSchema>
export type CreateUserInput = z.infer<typeof createdUserSchema>
export type LoginInput = z.infer<typeof loginSchema>