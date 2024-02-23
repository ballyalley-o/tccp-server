import 'reflect-metadata'
import goodlog from 'good-logs'
import { Request, Response, NextFunction } from 'express'
import { IExpressController } from '@interface/middleware'

const LogRequest: IExpressController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  goodlog.req(req, res, next)
  next()
}

export default LogRequest
