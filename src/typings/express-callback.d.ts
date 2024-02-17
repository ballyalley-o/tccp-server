import { Request, Response, NextFunction } from 'express'

export type ExpressCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => void
