import 'colors'
import { ExpressCallback } from '@typings'
import { Code } from '@constant/enum'

const notFound: ExpressCallback = (req, res, next) => {
  const error = new Error(`[NOT FOUND] - ${req.originalUrl}`.red)
  res.status(Code.NOT_FOUND)
  next(error)
}

export default notFound
