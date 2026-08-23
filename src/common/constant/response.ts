import type { Request, Response } from 'express'
import GLOBAL                     from '@config/global.config'
import { transl }                 from '@tccp/i18n'

const RESPONSE = {
  server: (req: Request, res: Response) => {
    const response = {
      name         : GLOBAL.APP_NAME,
      status       : 'Running',
      appServerName: GLOBAL.APP_SERVER_NAME,
      version      : GLOBAL.API_VERSION,
      url          : GLOBAL.API_URL,
      port         : GLOBAL.PORT,
      environment  : GLOBAL.ENV
    }
    res.send(response)
  },
  exists: (data: string) => transl('server.response.exists', { entity: data }),
  dbSaved: (data: string) => transl('server.response.db_saved', { entity: data }),

  /**
   * @Success response
   */
  success: {
    200                 : transl('server.response.success.status_200'),
    201                 : transl('server.response.success.status_201'),
    204                 : transl('server.response.success.status_204'),
    PHOTO_UPLOADED      : transl('server.response.success.photo_uploaded'),
    BADGE_UPLOADED      : transl('server.response.success.badge_uploaded'),
    AVATAR_UPLOADED     : transl('server.response.success.avatar_uploaded'),
    COURSES_DELETED     : (data: string) => transl('server.response.success.courses_deleted', { id: data }),
    COLLECTION_SEED     : transl('server.response.success.collection_seed'),
    COLLECTION_DESTROYED: transl('server.response.success.collection_destroyed'),
    LOGOUT              : transl('server.response.success.logout'),
    UPDATED             : transl('server.response.success.updated'),
    DELETED             : transl('server.response.success.deleted'),
    DELETED_ACCOUNT     : transl('server.response.success.deleted_account'),
    EMAIL_SENT          : transl('server.response.success.email_sent'),
    NODEMAILER_MESSAGE  : transl('server.response.success.nodemailer_message'),
  },

  /**
   * @Error response
   */
  error: {
    400                       : transl('server.response.error.status_400'),
    401                       : transl('server.response.error.status_401'),
    403                       : transl('server.response.error.status_403'),
    404                       : transl('server.response.error.status_404'),
    422                       : transl('server.response.error.status_422'),
    429                       : transl('server.response.error.status_429'),
    500                       : transl('server.response.error.status_500'),
    503                       : transl('server.response.error.status_503'),
    504                       : transl('server.response.error.status_504'),
    ACCOUNT_DELETED           : transl('server.response.error.account_deleted'),
    ACCOUNT_SCHEDULED_DELETE  : transl('server.response.error.account_scheduled_delete'),
    CORS_NOT_ALLOWED          : transl('server.response.error.cors_not_allowed'),
    ENTITY_EXISTS             : transl('server.response.error.entity_exists'),
    INVALID_START_DATE        : transl('server.response.error.invalid_start_date'),
    INVALID_START_DATE_PAST   : transl('server.response.error.invalid_start_date_past'),
    IS_REQUIRED               : (param: string) => transl('server.response.error.is_required', { field: param }),
    ORG_REQUIRED              : transl('server.response.error.org_required'),
    ALREADY_EXISTS            : (data: string) => transl('server.response.error.already_exists', { entity: data }),
    ONE_FEEDBACK              : transl('server.response.error.one_feedback'),
    NOT_ENROLLED_COURSE       : transl('server.response.error.not_enrolled_course'),
    NOT_FOUND_TOP_BOOTCAMPS   : transl('server.response.error.not_found_top_bootcamps'),
    NOT_FOUND_BOOTCAMP        : (data: string) => transl('server.response.error.not_found_bootcamp', { id: data }),
    NOT_FOUND_COURSE          : (data: string) => transl('server.response.error.not_found_course', { id: data }),
    NOT_FOUND_ENROLLMENT      : (data: string) => transl('server.response.error.not_found_enrollment', { id: data }),
    NOT_FOUND_FEEDBACK        : (data: string) => transl('server.response.error.not_found_feedback', { id: data }),
    NOT_FOUND                 : (data: string) => transl('server.response.error.not_found', { id: data }),
    BOOTCAMP_ALREADY_PUBLISHED: (data: string) => transl('server.response.error.bootcamp_already_published', { id: data }),
    FAILED_UPLOAD             : transl('server.response.error.failed_upload'),
    FAILED_UPLOAD_AVATAR      : transl('server.response.error.failed_upload_avatar'),
    FAILED_FILESIZE           : (fileSize: number) => transl('server.response.error.failed_filesize', { fileSize }),
    FAILED_SEED               : transl('server.response.error.failed_seed'),
    FAILED_DESTROY            : transl('server.response.error.failed_destroy'),
    FAILED_DELETE             : transl('server.response.error.failed_delete'),
    FAILED_DELETE_ACCOUNT     : transl('server.response.error.failed_delete_account'),
    FAILED_FIND               : transl('server.response.error.failed_find'),
    FAILED_CREATE             : transl('server.response.error.failed_create'),
    FAILED_UPDATE             : transl('server.response.error.failed_update'),
    FAILED_REGISTER           : transl('server.response.error.failed_register'),
    FAILED_LOGIN              : transl('server.response.error.failed_login'),
    FAILED_LOGOUT             : transl('server.response.error.failed_logout'),
    INVALID_CREDENTIAL        : transl('server.response.error.invalid_credential'),
    INVALID_PASSWORD          : transl('server.response.error.invalid_password'),
    INVALID_TOKEN             : transl('server.response.error.invalid_token'),
    NODEMAILER_MESSAGE        : transl('server.response.error.nodemailer_message'),
    NOT_STUDENT               : (user: string) => transl('server.response.error.not_student', { user }),
    NOT_OWNER                 : (user: string, course: string) => transl('server.response.error.not_owner', { user, entity: course }),
    ROLE_NOT_ALLOWED          : (data: string) => transl('server.response.error.role_not_allowed', { role: data }),
    parseErr                  : (err: any) => transl('server.response.error.parse_err', { error: err }),
    NotInstance               : transl('server.response.error.not_instance'),
    SESSION_EXPIRED           : transl('server.response.error.session_expired'),
    STATIC_CLASS              : transl('server.response.error.static_class'),
    FAILED_EMAIL              : transl('server.response.error.failed_email'),
    RESET_SUBJECT             : transl('server.response.error.reset_subject'),
    RESET_MESSAGE             : (resetUrl: string) => transl('server.response.error.reset_message', { resetUrl })
  }
}

export default RESPONSE
