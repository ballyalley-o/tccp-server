import { IPagination } from '@interface'
import { Request, Response, NextFunction, RequestHandler } from 'express'
import { Model } from '@typings'

export interface IRequestExtended extends Request {
  body: { [key: string]: string | undefined }
}

export interface IExpressController {
  (req: IRequestExtended, res: Response, next: NextFunction): void
}

export interface IResponseExtended extends Response {
  advancedResult: {
    success: boolean
    count: number
    pagination: IPagination
    data: Model[]
  }
}
