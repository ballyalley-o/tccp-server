import { MODULE } from "./module.config"

export const ACTION = [
    'create',
    'read',
    'update',
    'delete',
    'manage',
    'suspend',
    'restore',
    'archive',
    'reset',
    'change',
    'force'
] as const

function _getResource(modules: Record<string, any>): string[] {
  const resources: string[] = []

  for (const module of Object.values(modules)) {
    resources.push(module.name)

    if (module.submodule) {
      resources.push(..._getResource(module.submodule))
    }
  }

  return resources
}

const _RESOURCE = _getResource(MODULE)

export const PERMISSION: PermissionType[] = _RESOURCE.flatMap(resource => ACTION.map(action => `${action}:${resource}` as PermissionType))