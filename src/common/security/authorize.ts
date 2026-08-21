import type { Response, NextFunction } from 'express'
import { RESPONSE }                    from '@common/constant'
import { Code }                        from '@common/constant/enum'
import ErrorResponse                    from '@common/util/error-response'

/**
 * Grant access to specific roles
 *
 * @param roles - roles to be granted access
 * @returns {Function} - middleware function
 */
const authorize = (...roles: AppUserRoleType[]): MiddlewareFunction => {
  return async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const role = req.user.role
    if (!roles.includes(role)) {
      return next(new ErrorResponse(RESPONSE.error.ROLE_NOT_ALLOWED(role), (res.statusCode = Code.FORBIDDEN)))
    }
    next()
  }
}

export { authorize }
