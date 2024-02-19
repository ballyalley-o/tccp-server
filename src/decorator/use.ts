import 'reflect-metadata'
import { RequestHandler } from 'express'
import { MetaKey } from '@constant/enum'

function use(middleware: RequestHandler) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    const middlewares =
      Reflect.getMetadata(MetaKey.middleware, target, key) || []

    Reflect.defineMetadata(
      MetaKey.middleware,
      [...middlewares, middleware],
      target,
      key
    )
  }
}

export default use
