import { Response } from 'express'

declare global {
  namespace Express {
    interface Request {
          user: {
            id  : string
            role: string | { _id?: string; name?: string }
          }
        }
    interface Response {
      advanceResult: AdvancedResults
    }
  }
}
