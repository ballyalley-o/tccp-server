import jwt from 'jsonwebtoken'
import goodlog from 'good-logs'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ParsedQs } from 'qs'
import { asyncHandler } from '@middleware'
import { ErrorResponse } from '@util'
import { User } from '@model'
import { Key, Code } from '@constant/enum'
import { GLOBAL } from '@config'
import { RESPONSE } from '@constant'
import { NextFunction } from 'express'

/**
 * Protect routes
 */
const protect = asyncHandler(async (req: any, res, next) => {
  let token

  if (req.cookies.token) {
    token = req.cookies.token
  } else if (req.headers.authorization && req.headers.authorization.startsWith(Key.Bearer)) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new ErrorResponse(RESPONSE.error[401], Code.UNAUTHORIZED))
  }
  try {
    const decoded = jwt.verify(token, GLOBAL.JWT_SECRET as string) as any
    req.user = await User.findById(decoded.id).select(Key.PasswordSelect)

    next()
  } catch (err) {
    return next(new ErrorResponse(RESPONSE.error[401], Code.UNAUTHORIZED))
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
const authorize = (...roles: string[]): MiddlewareFunction => {
  return async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const role = req.user.role
    if (!roles.includes(role)) {
      return next(new ErrorResponse(RESPONSE.error.ROLE_NOT_ALLOWED(role), 403))
    }
    next()
  }
}

export { protect, authorize }
