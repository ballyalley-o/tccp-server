import 'reflect-metadata'
import { PathDir } from '@constant'
import { conNex } from '@util'
import { AppRouter } from '@app-router'
import { Method, MetaKey } from '@constant/enum'
import { autoValidate } from '@decorator/body-validator'

/**
 *
 * @param routePrefix - The prefix for the route
 * @returns - A function that takes in a target and assigns the routeHandler to the router
 */
function controller(routePrefix: string) {
  return function (target: Function) {
    const router = AppRouter.instance

    Object.getOwnPropertyNames(target.prototype).forEach((key) => {
      const routeHandler = target.prototype[key]
      const path = Reflect.getMetadata(MetaKey.path, target.prototype, key)
      const method: Method = Reflect.getMetadata(
        MetaKey.method,
        target.prototype,
        key
      )
      const middlewares =
        Reflect.getMetadata(MetaKey.middleware, target.prototype, key) || []

      const requiredKeys =
        Reflect.getMetadata(MetaKey.validator, target.prototype, key) || []
      const validator = autoValidate(requiredKeys)

      if (path) {
        let connectedPath = conNex(PathDir.API_ROOT, routePrefix, path)
        router[method](connectedPath, ...middlewares, validator, routeHandler)
      }
    })
  }
}

export default controller
