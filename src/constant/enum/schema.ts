enum SCHEMA {
  // @bootcamp
  NAME = 'Please add a bootcamp name/title',
  MAX_LENGTH_NAME = 'Name can not be more than 50 characters',
  DESCRIPTION = 'Please add a description',
  MAX_LENGTH_DESCRIPTION = 'Description can not be more than 500 characters',
  URL = 'Please use a valid URL with HTTP or HTTPS',
  MAX_LENGTH_PHONE = 'Phone number can not be longer than 20 characters',
  EMAIL = 'Please add a valid email',
  ADDRESS = 'Please add an address',
  DURATION = 'Please add a duration',
  LOCATION_TYPE = 'Point',
  LOCATION_COORDINATES_INDEX = '2dsphere',
  AVERAGE_RATING_MIN = 'Rating must be at least 1',
  AVERAGE_RATING_MAX = 'Rating must can not be more than 10',
  DEFAULT_AVATAR = 'no-photo.jpg',
  CAREERS = 'Please add one or more careers',
  // @course
  COURSE_TITLE = 'Please add a course title',
  COURSE_WEEK = 'Please add number of weeks',
  COURSE_TUITION = 'Please add a tuition cost',
  MINIMUM_SKILL = 'Please add a minimum skill',
}

export default SCHEMA
