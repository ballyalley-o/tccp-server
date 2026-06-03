import { Response } from 'express'

declare global {
  namespace Express {
    interface Request {
          user: {
            id  : string
            role: Role
          }
        }
    interface Response {
      advanceResult: AdvancedResults
    }
  }
}
