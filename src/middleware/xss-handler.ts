import { Request, Response, NextFunction } from 'express'
import { filterXSS } from 'xss'
import { Key, TYPE } from '@constant/enum'

const xssHandler = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === TYPE.Object) {
    const sanitizedBody = filterXSS(JSON.stringify(req.body), {
      whiteList: {},
      stripIgnoreTag: true,
      stripIgnoreTagBody: [Key.Script],
    })
    req.body = JSON.parse(sanitizedBody)
  }
  next()
}

export default xssHandler
