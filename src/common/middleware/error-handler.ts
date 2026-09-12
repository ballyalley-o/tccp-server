import type { Request, Response, NextFunction } from 'express'
import GLOBAL                                   from '@config/global.config'
import { ERROR, RESPONSE }                      from '@common/constant'
import { Code }                                 from '@common/constant/enum'

class ErrorCallback extends Error {
  kind       : string
  code       : string | number
  errors     : any[]
  errorCode ?: string
  messageKey?: Parameters<Request['t']>[0]
  params    ?: Parameters<Request['t']>[1]

  constructor(message: string, kind: string, code: number, errors: any[]) {
    super(message)
    this.kind   = kind
    this.errors = errors
    this.code   = code
    this.name   = this.constructor.name
  }
}

const errorHandler = (err: ErrorCallback, req: Request, res: Response, next: NextFunction) => {
  let statusCode     = res.statusCode === 0 ? 500 : res.statusCode
  let message        = err.message
  let errors         = err.errors
  let ENV:AppEnvType = 'production'
  const translateIfKey = (value: string) => {
    const translated = req.t(value as Parameters<Request['t']>[0])

    return translated === value ? value : translated
  }

  if (err.name === ERROR.CAST_ERROR && err.kind === ERROR.OBJECT_ID) {
    statusCode = 404
    message    = RESPONSE.error[404]
  }

  if (err.code === 11000) {
    statusCode = 403
    throw new Error(RESPONSE.error.ENTITY_EXISTS)
  }

  if (err.errors) {
    const errorArr   = Object.values(err.errors).map((err: any) => translateIfKey(err.message))
          statusCode = 400
          errors     = errorArr
  }

  if (err.messageKey) {
    message = req.t(err.messageKey, err.params)
  }

  if (!message && statusCode === Code.NOT_FOUND) {
    message = req.t('server.error.not_found')
  }

  res.status(statusCode).json({
    success   : false,
    errorCode : err.errorCode,
    messageKey: err.messageKey,
    message   : message || errors,
    stack     : GLOBAL.ENV === ENV ? err.stack: null
  })
}

export default errorHandler
