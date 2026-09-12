import type { LocaleKey, LocaleParams } from '@common/i18n'

type ErrorResponseOptions = {
  errorCode ?: string
  messageKey?: LocaleKey
  params    ?: LocaleParams
}

class ErrorResponse extends Error {
  public errorCode ?: string
  public messageKey?: LocaleKey
  public params    ?: LocaleParams

  constructor(message: string, public statusCode: number, options: ErrorResponseOptions = {}) {
    super(message)
    this.statusCode = statusCode
    this.errorCode  = options.errorCode
    this.messageKey = options.messageKey
    this.params     = options.params
  }

  public static localized(statusCode: number, errorCode: string, messageKey: LocaleKey, params?: LocaleParams) {
    return new ErrorResponse('', statusCode, {
      errorCode,
      messageKey,
      params
    })
  }
}

export default ErrorResponse
