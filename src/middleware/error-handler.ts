import { Request, Response, NextFunction } from 'express'
import ValidationError from 'mongoose'
import { RESPONSE } from '@constant'
import { GLOBAL } from '@config'
import { Key } from '@constant/enum'

class ErrorCallback extends Error {
  kind: string
  code: string | number
  errors: any[]

  constructor(message: string, kind: string, code: number, errors: any[]) {
    super(message)
    this.kind = kind
    this.errors = errors
    this.code = code
    this.name = this.constructor.name
  }
}

const errorHandler = (err: ErrorCallback, req: Request, res: Response, next: NextFunction) => {
  let statusCode = res.statusCode === 0 ? 500 : res.statusCode
  let message = err.message
  let errors = err.errors
  let ENV = Key.Production

  if (err.name === Key.CastError && err.kind === Key.ObjectId) {
    statusCode = 404
    message = RESPONSE.error[404]
  } else if (err.code === 11000) {
    statusCode = 403
    message = RESPONSE.error.ENTITY_EXISTS
  } else if (err instanceof (ValidationError as any)) {
    statusCode = 400
    const errorArr = Object.values(err.errors).map((err: any) => err.message)
    errors = errorArr
    throw new Error(errors.join(', '))
  }

  res.status(statusCode).json({
    message: message || errors,
    stack: GLOBAL.ENV === ENV ? err.stack : null
  })
}

export default errorHandler
