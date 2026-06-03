import { z } from 'zod'

// User Schemas
export const userRegisterSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['user', 'publisher', 'admin']).optional().default('user'),
  }),
})

export const userLoginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
})

export const userUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    website: z.string().url().optional(),
  }),
})

// Bootcamp Schemas
export const bootcampCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Bootcamp name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    website: z.string().url('Invalid website URL'),
    phone: z.string().regex(/^\d{10,}$/, 'Invalid phone number'),
    email: z.string().email('Invalid email'),
    address: z.string().min(5, 'Address is required'),
    careers: z.array(z.string()).optional(),
    housing: z.boolean().optional(),
    jobAssistance: z.boolean().optional(),
    jobGuarantee: z.boolean().optional(),
    acceptGi: z.boolean().optional(),
  }),
})

export const bootcampUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    website: z.string().url().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().min(5).optional(),
    careers: z.array(z.string()).optional(),
    housing: z.boolean().optional(),
    jobAssistance: z.boolean().optional(),
    jobGuarantee: z.boolean().optional(),
    acceptGi: z.boolean().optional(),
  }),
})

// Course Schemas
export const courseCreateSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Course title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    weeks: z.number().int().min(1, 'Weeks must be at least 1'),
    tuition: z.number().min(0, 'Tuition must be a positive number'),
    minimumSkill: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    scholarshipAvailable: z.boolean().optional(),
  }),
})

export const courseUpdateSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    weeks: z.number().int().min(1).optional(),
    tuition: z.number().min(0).optional(),
    minimumSkill: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    scholarshipAvailable: z.boolean().optional(),
  }),
})

// Query Schemas
export const paginationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    select: z.string().optional(),
    sort: z.string().optional(),
  }),
})

export type UserRegisterInput = z.infer<typeof userRegisterSchema>
export type UserLoginInput = z.infer<typeof userLoginSchema>
export type BootcampCreateInput = z.infer<typeof bootcampCreateSchema>
export type CourseCreateInput = z.infer<typeof courseCreateSchema>
