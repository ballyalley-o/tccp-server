import type { Request, Response, NextFunction } from 'express'
import { filterXSS }                            from 'xss'

const xssHandler = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === 'object') {
    const sanitizedBody = filterXSS(JSON.stringify(req.body), {
      whiteList         : {},
      stripIgnoreTag    : true,
      stripIgnoreTagBody: ['script'],
    })
    req.body = JSON.parse(sanitizedBody)
  }
  next()
}

export default xssHandler
