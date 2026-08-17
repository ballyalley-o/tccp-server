import { Request, Response, NextFunction, RequestHandler } from 'express'

declare global {
  type AsyncHandlerType = (req: Request, res: Response, next: NextFunction) => Promise<void>

  interface IRequestExtended extends Request {
    body: { [key: string]: string | undefined }
  }

  interface IExpressController {
    (req: IRequestExtended, res: Response, next: NextFunction): void
  }

  interface IUserRequest {
    user: {
      id: string
      role: string
    }
  }

  interface RouteHandlerDescriptor extends PropertyDescriptor {
    value?: RequestHandler
  }

  type MiddlewareFunction = (
    req : Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res : Response<any, Record<string, any>>,
    next: NextFunction
  ) => Promise<void>

  type ExpressCallback = (
  req : Request,
  res : Response,
  next: NextFunction
) => void

}

export {}