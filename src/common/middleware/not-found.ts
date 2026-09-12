import { Code }      from '@common/constant/enum'
import ErrorResponse from '@common/util/error-response'

const notFound: ExpressCallback = (req, res, next) => {
  const error = new ErrorResponse('', Code.NOT_FOUND, {
    errorCode : 'ROUTE_NOT_FOUND',
    messageKey: 'server.error.route_not_found',
    params    : { path: req.originalUrl }
  })

  next(error)
}

export default notFound
