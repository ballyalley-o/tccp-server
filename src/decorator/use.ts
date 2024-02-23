import 'reflect-metadata'
import { RequestHandler } from 'express'
import { MetaKey } from '@constant/enum'

function use(middleware: RequestHandler) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    let middlewares =
      Reflect.getMetadata(MetaKey.middleware, target, key) || []
      middlewares.push(middleware)
      Reflect.defineMetadata(MetaKey.middleware, middlewares, target, key)
  }
}

export default use
