import { Response } from 'express'

declare global {
  namespace Express {
    interface Request {
      user: {
        id    : string
        role  : string
        _role?: {
          _id    ?: string
          name   ?: string
          actions?: string[]
        }
        roleActions?: string[]
      }
    }
    interface Response {
      advanceResult: AdvancedResults
    }
  }
}
