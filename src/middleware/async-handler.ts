import { Request, Response, NextFunction } from 'express'
// import { IResponseExtended } from '@interface'

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>

const asyncHandler = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export default asyncHandler
