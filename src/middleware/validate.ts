import type { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError }                  from 'zod'

/**
 * Middleware factory for validating request data with Zod
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await schema.parseAsync({
        body  : req.body,
        query : req.query,
        params: req.params,
      }) as any

      // Replace request data with validated data
      req.body   = result.body || req.body
      req.query  = result.query || req.query
      req.params = result.params || req.params

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err: any) => ({
          path   : err.path.join('.'),
          message: err.message,
        }))

        return res.status(400).json({
          success: false,
          error  : 'Validation failed',
          details: formattedErrors,
        })
      }

      next(error)
    }
  }
}

export default validate
