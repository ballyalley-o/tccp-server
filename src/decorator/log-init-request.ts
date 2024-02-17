import { Request, Response, NextFunction } from 'express'

function LogInitRequest(
  target: any,
  key: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value

  descriptor.value = function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log('')
    console.warn(`[${new Date()}] Initial Request to ${key}`)
    console.log('')
    originalMethod.call(this, req, res, next)
  }

  return descriptor
}

export default LogInitRequest
