import { Request, Response, NextFunction, RequestHandler } from 'express'

export interface IRequestExtended extends Request {
  body: { [key: string]: string | undefined }
}

export interface IExpressController {
  (req: IRequestExtended, res: Response, next: NextFunction): void
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
