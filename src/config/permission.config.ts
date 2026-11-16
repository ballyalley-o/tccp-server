import { MODULE, ACTION } from "./module.config"

function _getResource(modules: Record<string, Module.ConfigType>, prefix = ''): string[] {
  const resources: string[] = []

  for (const module of Object.values(modules)) {
    const resource = prefix ? `${prefix}-${module.name}` : module.name
    resources.push(module.name)

    if (prefix) {
      resources.push(resource)
    }

    if (module.submodule) {
      resources.push(..._getResource(module.submodule, resource))
    }
  }

  return resources
}

const _RESOURCE = [...new Set(_getResource(MODULE))]

export const PERMISSION: PermissionType[] = [
  'manage:any',
  ..._RESOURCE.flatMap(resource => ACTION.map(action => `${action}:${resource}` as PermissionType))
]
