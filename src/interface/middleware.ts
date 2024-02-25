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
    message?: string
    count: number
    pagination: IPagination
    data: Model[]
  }
}

export declare interface IUserRequest {
  user: {
    id: string
    role: string
  }
}

export interface RouteHandlerDescriptor extends PropertyDescriptor {
  value?: RequestHandler
}
