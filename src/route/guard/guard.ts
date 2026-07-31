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
    const decoded = jwt.verify(token, GLOBAL.JWT_SECRET as string) as any
    const cacheKey = `user:${decoded.id}`

    let user = cache.get(cacheKey)

    if (!user) {
      user = await User.findById(decoded.id).select(Key.PasswordSelect)

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
