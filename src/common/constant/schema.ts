export const SCHEMA: Record<string, LocaleKey> = {
// @bootcamp
  NAME                  : 'server.schema.name',
  MAX_LENGTH_NAME       : 'server.schema.max_length_name',
  DESCRIPTION           : 'server.schema.description',
  MIN_LENGTH_DESCRIPTION: 'server.schema.min_length_description',
  MAX_LENGTH_DESCRIPTION: 'server.schema.max_length_description',
  URL                   : 'server.schema.url',
  MAX_LENGTH_PHONE      : 'server.schema.max_length_phone',
  EMAIL                 : 'server.schema.email',
  ADDRESS               : 'server.schema.address',
  DURATION              : 'server.schema.duration',
  AVERAGE_RATING_MIN    : 'server.schema.average_rating_min',
  AVERAGE_RATING_MAX    : 'server.schema.average_rating_max',

  CAREERS                   : 'server.schema.careers',
        // @course
  COURSE_TITLE  : 'server.schema.course_title',
  COURSE_WEEK   : 'server.schema.course_week',
  COURSE_TUITION: 'server.schema.course_tuition',
  MINIMUM_SKILL : 'server.schema.minimum_skill',
      // @feedback
  FEEDBACK_TITLE : 'server.schema.feedback_title',
  FEEDBACK_RATING: 'server.schema.feedback_rating',
      // @user
  FIRST_NAME: 'server.schema.first_name',
  LAST_NAME : 'server.schema.last_name',
  PASSWORD  : 'server.schema.password'
} as const
