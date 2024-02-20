enum PathParam {
  ORIGIN = '/',
  ID = '/:id',
  CREATE = '/create',
  HOME = '/home',
  DASHBOARD = '/dashboard',
  API = '/api',
  AUTH = '/auth',
  USER = '/user',
  COURSE = '/course',
  BOOTCAMP = '/bootcamp',
  DISTANCE = '/radius/:zipcode/:distance',
  FEEDBACK = '/feedback',
  LOG_IN = '/log-in',
  LOG_OUT = '/log-out',
  DIST = 'dist',
  // @redir
  REDIR_FEEDBACK = '/:bootcampId/feedback',
  REDIR_COURSE = '/:bootcampId/course',
}
export default PathParam
