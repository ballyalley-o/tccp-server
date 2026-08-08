import GLOBAL                          from '@config/global'
import type { Response, NextFunction } from 'express'
import jwt                             from 'jsonwebtoken'
import type { MiddlewareFunction }     from '@typings/middleware'
import { asyncHandler }                from '@middleware'
import { User }                        from '@model'
import { Key, Code }                   from '@constant/enum'
import { RESPONSE }                    from '@constant'
import { ErrorResponse }               from '@util'
import { cache }                       from '@util/cache'
 
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
 
/**
 * Protect routes
 */
export const protect = asyncHandler(async (req: any, res, next) => {
  let token
 
  if (req.cookies.token) {
    token = req.cookies.token
  } else if (req.headers.authorization && req.headers.authorization.startsWith(Key.Bearer)) {
    token = req.headers.authorization.split(' ')[1]
  }
 
  if (!token) {
    return next(new ErrorResponse(RESPONSE.error[401], (res.statusCode = Code.UNAUTHORIZED)))
  }
 
  try {
    const decoded  = jwt.verify(token, GLOBAL.JWT_SECRET as string) as any
    const cacheKey = `user:${decoded.id}`
 
    let user = cache.get(cacheKey)
 
    if (!user) {
      user = await User.findById(decoded.id).populate('role').select(Key.PasswordSelect)
 
      if (user && user.role && typeof user.role === 'object') {
        ;(user as any)._role       = user.role
        ;(user as any).role        = (user as any)._role.name
        ;(user as any).roleActions = Array.isArray((user as any)._role.actions)
          ? (user as any)._role.actions
          : []
      } else if (user) {
        ;(user as any).roleActions = []
      }
 
      if (user) {
        cache.set(cacheKey, user, 5 * 60 * 1000)
      }
    }
 
    req.user = user
    next()
  } catch (err) {
    return next(new ErrorResponse(RESPONSE.error[401], (res.statusCode = Code.UNAUTHORIZED)))
  }
})
 
/**
 * Grant access to specific roles
 *
 * @param roles - roles to be granted access
 * @returns {Function} - middleware function
 */
export const authorize = (...roles: AppUserRoleType[]): MiddlewareFunction => {
  return async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const role = req.user.role
    if (!roles.includes(role)) {
      return next(new ErrorResponse(RESPONSE.error.ROLE_NOT_ALLOWED(role), (res.statusCode = Code.FORBIDDEN)))
    }
    next()
  }
}
 
export const authorizeAction = (action: string): MiddlewareFunction => {
  return async (req: any, res: Response, next: NextFunction): Promise<void> => {
    if (!hasAction(req, action)) {
      const role = req.user?.role ?? Key.None
      return next(new ErrorResponse(RESPONSE.error.ROLE_NOT_ALLOWED(role), (res.statusCode = Code.FORBIDDEN)))
    }
    next()
  }
}
 
export { hasAction }
