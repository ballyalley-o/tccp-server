enum PathParam {
  ALL = '*',
  F_SLASH = '/',
  SCH_SEPARATOR = '://',
  ID = '/:id',
  CREATE = '/create',
  HOME = '/home',
  DASHBOARD = '/dashboard',
  API = '/api',
  AUTH = '/auth',
  USER = '/user',
  COURSE = '/course',
  BOOTCAMP = '/bootcamp',
  PHOTO = '/photo',
  UPLOAD_PHOTO = '/:id/photo',
  UPLOAD_BADGE = '/:id/badge',
  UPLOAD_AVATAR = '/:id/avatar',
  DISTANCE = '/radius/:zipcode/:distance',
  FEEDBACK = '/feedback',
  LOG_IN = '/log-in',
  LOG_OUT = '/log-out',
  REGISTER = '/register',
  ACCOUNT = '/account',
  UPDATE = '/update',
  UPDATE_PASSWORD = '/update-password',
  FORGOT_PASSWORD = '/forgot-password',
  RESET_PASSWORD = '/reset-password',
  RESET_TOKEN = '/:resetToken',
  RESET_URL = '/reset-password/:resetToken',
  DIST = 'dist',
  PUBLIC = 'public',
  // @redir
  REDIR_FEEDBACK = '/:bootcampId/feedback',
  REDIR_COURSE = '/:bootcampId/course'
}
export default PathParam
