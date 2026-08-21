function ServerStatus(target: IAppDbTarget, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    try {
      originalMethod.apply(this, args)
      ;(this as IAppDbTarget).isConnected = true
    } catch (error: any) {
      ;(this as IAppDbTarget).isConnected = false
      throw error
    }
  }

  return descriptor
}

export default ServerStatus
