import 'colors'
import { ExpressCallback } from '@typings'

const notFound: ExpressCallback = (req, res, next) => {
  const error = new Error(`[NOT FOUND] - ${req.originalUrl}`.red)
  res.status(404)
  next(error)
}

export default notFound
