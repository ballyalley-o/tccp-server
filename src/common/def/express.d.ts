import { Response } from 'express'
import type { LocaleKey, LocaleLang, LocaleParams } from '@common/i18n'

declare global {
  namespace Express {
    interface Request {
      locale: LocaleLang
      t     : (key: LocaleKey, params?: LocaleParams) => string
      user  : {
        id    : string
        role  : string
        _role?: {
          _id    ?: string
          name   ?: string
          actions?: string[]
        }
        roleActions?: string[]
      }
    }
    interface Response {
      advanceResult: AdvancedResults
    }
  }
}
