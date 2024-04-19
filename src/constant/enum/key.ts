enum Key {
  Save = 'save',
  Remove = 'remove',
  Name = 'name',
  Host = 'host',
  Image = 'image',
  Script = 'script',

  MorganShort = 'short',
  MorganDev = 'dev',

  // Roles
  Trainer = 'trainer',
  Admin = 'admin',
  Student = 'student',

  Client = 'client',
  Server = 'server',
  Public = 'public',
  IndexHtml = 'index.html',

  // @tag
  id = '_id',
  User = 'User',
  Course = 'Course',
  Bootcamp = 'Bootcamp',
  Cohort = 'Cohort',
  Feedback = 'Feedback',

  UserVirtual = 'user',
  CourseVirtual = 'course',
  BootcampVirtual = 'bootcamp',

  CourseSelect = 'name description',
  DefaultSelect = 'name description',
  PasswordSelect = '-password',
  BootcampPopulate = 'firstname email',

  Cookie = 'cookie',
  Token = 'token',
  Bearer = 'Bearer',
  None = 'none',

  HTTPAdapter = 'https',

  Hex = 'hex',
  CryptoHash = 'sha256',
  // @error keys
  ObjectId = 'ObjectId',
  CastError = 'CastError',
  Connected = 'CONNECTED 🟢',
  NotConnected = 'NOT CONNECTED 🔴',
  Environment = ' ENVIRONMENT: ',
  Production = 'production',
  Development = 'development',
  Password = '+password',
  UnhandledRejection = 'unhandledRejection',

  // @logger - req
  ReqMethod = ' Request Method: ',
  ReqURL = ' Request URL: ',
  ReqTime = ' Request Time: ',
  // @logger - server
  ServerPort = ' SERVER PORT: ',
  ServerAPIVersion = ' API VERSION: ',
  ServerStatus = ' SERVER STATUS: ',

  // template params
  ResetLink = '{{resetLink}}',
  Username = '{{username}}',
  EmailContent = '{{emailContent}}',

  // @nodemailer - mailtrap
  MessageSent = ' Message sent: %s ',
  MessageError = ' Error occurred: %s ',

  // @geocoder
  Google = 'google',
  MapQuest = 'mapquest',
  GeocoderType = 'Point'
}

export default Key
