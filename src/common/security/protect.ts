import jwt                    from 'jsonwebtoken'
import GLOBAL                 from '@config/global.config'
import { AUTH_KEY }           from '@common/constant'
import { Code }               from '@common/constant/enum'
import { cache }              from '@common/util/cache'

import asyncHandler           from '@common/middleware/async-handler'
import ErrorResponse          from '@common/util/error-response'
import AuthUser               from '@module/auth/auth.user/model/AuthUser'
/**
 * Protect routes
 */
const protect = asyncHandler(async (req: any, res, next) => {
  let token

  if (req.cookies?.token) {
    token = req.cookies.token
  } else if (req.headers.authorization && req.headers.authorization.startsWith(AUTH_KEY.BEARER)) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(ErrorResponse.localized((res.statusCode = Code.UNAUTHORIZED), 'UNAUTHORIZED', 'server.response.error.status_401'))
  }

  try {
    const decoded = jwt.verify(token, GLOBAL.JWT_SECRET as string) as { id: string; tokenVersion: number }
    const cacheKey = `user:${decoded.id}`

    let user = cache.get(cacheKey)

    if (!user) {
      user = await AuthUser.findById(decoded.id).populate('role').select('-password')

      if (!user) {
        return next(ErrorResponse.localized((res.statusCode = Code.UNAUTHORIZED), 'UNAUTHORIZED', 'server.response.error.status_401'))
      }

      if (user && user.role && typeof user.role === 'object') {
        ;(user as any)._role = user.role
        ;(user as any).role = (user as any)._role.name
        ;(user as any).roleActions = Array.isArray((user as any)._role.actions) ? (user as any)._role.actions : []
      } else {
        ;(user as any).roleActions = []
      }
      cache.set(cacheKey, user, 5 * 60 * 1000)
    }

    if (user.status !== 'active') {
      return next(ErrorResponse.localized(Code.UNAUTHORIZED, 'ACCOUNT_DELETED', 'server.response.error.account_deleted'))
    }

    if (user.tokenVersion !== decoded.tokenVersion) {
      return next(ErrorResponse.localized(Code.UNAUTHORIZED, 'SESSION_EXPIRED', 'server.response.error.session_expired'))
    }

    req.user = user
    next()
  } catch (err) {
    return next(ErrorResponse.localized((res.statusCode = Code.UNAUTHORIZED), 'UNAUTHORIZED', 'server.response.error.status_401'))
  }
})

export { protect }
