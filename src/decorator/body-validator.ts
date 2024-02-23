import 'reflect-metadata'
import { RequestHandler, Request, Response, NextFunction } from 'express'
import { MetaKey, Code } from '@constant/enum'
import { RESPONSE } from '@constant'

export function bodyValidator(...keys: string[] | []) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    Reflect.defineMetadata(MetaKey.validator, keys, target, key)
  }
}

export function autoValidate(keys: string): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
      res.status(Code.UNPROCESSABLE_ENTITY).send(RESPONSE.error[422])
      return
    }

    for (let key of keys) {
      if (!req.body[key]) {
        res.status(Code.UNPROCESSABLE_ENTITY).send(RESPONSE.error[422])
        return
      }
    }

    next()
  }
}
