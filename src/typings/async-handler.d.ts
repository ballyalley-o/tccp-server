export type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>
