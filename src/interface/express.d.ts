import { Response } from 'express'

declare global {
  namespace Express {
    interface Response {
      advancedResult: AdvancedResults
    }
  }
}
