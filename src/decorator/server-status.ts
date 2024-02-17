import { IIsConnected } from '@interface/utility'

function ServerStatus(
  target: IIsConnected,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    try {
      originalMethod.apply(this, args)
      ;(this as IIsConnected).isConnected = true
    } catch (error: any) {
      ;(this as IIsConnected).isConnected = false
      throw error
    }
  }

  return descriptor
}

export default ServerStatus
