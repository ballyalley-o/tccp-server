import 'reflect-metadata'
import { Method, MetaKey } from '@constant/enum'
import { RouteHandlerDescriptor } from '@interface/middleware'

/**
 *
 * @param path  - The path for the route
 * @method      - GET | POST | PUT | DELETE | PATCH | OPTIONS
 * @returns  - A function that takes in a target and assigns the path to the target
 */

export function bindRoute(method: string) {
  return function (path: string) {
    return function (target: any, key: string, desc: RouteHandlerDescriptor) {
      Reflect.defineMetadata(MetaKey.path, path, target, key)
      Reflect.defineMetadata(MetaKey.method, method, target, key)
    }
  }
}

export const get = bindRoute(Method.get)
export const post = bindRoute(Method.post)
export const put = bindRoute(Method.put)
export const del = bindRoute(Method.del)
export const patch = bindRoute(Method.patch)
export const options = bindRoute(Method.options)
