import { IPagination } from '@interface'
import { Request, Response, NextFunction, RequestHandler } from 'express'
import { Model } from '@typings'

export interface IRequestExtended extends Request {
  body: { [key: string]: string | undefined }
}

export interface IExpressController {
  (req: IRequestExtended, res: Response, next: NextFunction): void
}

// Add custom property 'advancedResults' to Response type
export interface IResponseExtended extends Response {
  advancedResults: {
    success: boolean
    count: number
    pagination: IPagination
    data: Model[]
  }
}
