import { Request, Response, NextFunction } from 'express'
// import { IResponseExtended } from '@interface'

// interface IRequestExtended extends Request {
//   user: {
//     id: string // adjust the type accordingly
//     // other user properties if needed
//   }
// }

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
