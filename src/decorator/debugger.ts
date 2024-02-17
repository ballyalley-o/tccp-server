import { logger } from '@middleware'

/**
 *  A decorator that helps for debugging
 *  - Logs the method name and the time it was called
 *
 * @param message - Message to be logged
 * @returns - A function that takes in a target and key and assigns the debug function to the method
 */
function debug(message?: string) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    const originalMethod = desc.value

    desc.value = function (...args: any[]) {
      logger.log(
        `[${new Date().toISOString()}] Debugging ${key}${
          message ? `: ${message}` : ''
        }`
      )
      const result = originalMethod.apply(this, args)
      logger.log(`[${new Date().toISOString()}] ${key} execution completed`)
      return result
    }
  }
}

export default debug
