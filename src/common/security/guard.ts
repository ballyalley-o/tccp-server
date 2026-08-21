import type { Response, NextFunction } from 'express'
import { RESPONSE }                    from '@common/constant'
import { Code }                        from '@common/constant/enum'

import ErrorResponse                   from '@common/util/error-response'

const getRoleActions = (req: any): string[] => {
  const roleActions = req.user?.roleActions
  if (Array.isArray(roleActions)) {
    return roleActions
  }

  const roleObj = req.user?._role
  if (roleObj && Array.isArray(roleObj.actions)) {
    return roleObj.actions
  }

  return []
}

const hasAction = (req: any, action: string): boolean => {
  const actions = getRoleActions(req)
  return actions.includes(action) || actions.includes('manage:any')
}

const authorizeAction = (action: PermissionType): MiddlewareFunction => {
  return async (req: any, res: Response, next: NextFunction): Promise<void> => {
    if (!hasAction(req, action)) {
      const role = req.user?.role ?? 'none'
      return next(new ErrorResponse(RESPONSE.error.ROLE_NOT_ALLOWED(role), (res.statusCode = Code.FORBIDDEN)))
    }
    next()
  }
}

export { getRoleActions, hasAction, authorizeAction }
