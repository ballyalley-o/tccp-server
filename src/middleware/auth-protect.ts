import GLOBAL                                   from '@config/global.config'
import type { Request, Response, NextFunction } from 'express'
import { ParamsDictionary }                     from 'express-serve-static-core'
import { ParsedQs }                             from 'qs'
import jwt                                      from 'jsonwebtoken'
import { asyncHandler }                         from '@middleware'
import { User }                                 from '@model'
import { AUTH_KEY, RESPONSE }                   from '@constant'
import { Code }                                 from '@constant/enum'
import { ErrorResponse }                        from '@util'
import { cache }                                from '@util/cache'

/**
 * Protect routes
 */
const protect = asyncHandler(async (req: any, res, next) => {
  let token

  if (req.cookies.token) {
    token = req.cookies.token
  } else if (req.headers.authorization && req.headers.authorization.startsWith(AUTH_KEY.BEARER)) {
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
      user = await User.findById(decoded.id).populate('role').select('-password')

      if (user && user.role && typeof user.role === 'object') {
        ;(user as any)._role = user.role
        ;(user as any).role  = (user as any)._role.name
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

type MiddlewareFunction = (
  req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
  res: Response<any, Record<string, any>>,
  next: NextFunction
) => Promise<void>

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

export { protect, authorize }
