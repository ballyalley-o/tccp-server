import type { Request, Response, NextFunction } from 'express'
import { DEFAULT_LOCALE, isSupportedLocale }    from './locale.config'
import { transl }                               from './transl'

const normalizeLocale = (value?: string): string | undefined => value?.trim().split(',')[0]?.split('-')[0]?.toLowerCase()

export const localeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestedLocale =
    normalizeLocale(req.header('x-locale')) ||
    normalizeLocale(req.cookies?.locale) ||
    normalizeLocale(req.header('accept-language'))

  req.locale = isSupportedLocale(requestedLocale) ? requestedLocale : DEFAULT_LOCALE
  req.t      = (key, params) => transl(key, params, req.locale)

  res.setHeader('Content-Language', req.locale)

  next()
}

export default localeMiddleware
