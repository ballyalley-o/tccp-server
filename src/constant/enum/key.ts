enum Key {
  Save = 'save',
  Remove = 'remove',
  Name = 'name',

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
  CourseVirtual = 'courses',
  BootcampVirtual = 'bootcamp',

  Cookie = 'cookie',
  Token = 'token',
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

  // @logger - req
  ReqMethod = ' Request Method: ',
  ReqURL = ' Request URL: ',
  ReqTime = ' Request Time: ',
  // @logger - server
  ServerPort = ' SERVER PORT: ',
  ServerAPIVersion = ' API VERSION: ',
  ServerStatus = ' SERVER STATUS: ',
  // @nodemailer - mailtrap
  MessageSent = ' Message sent: %s ',
  MessageError = ' Error occurred: %s ',

  // @geocoder
  Google = 'google',
  MapQuest = 'mapquest',
  GeocoderType = 'Point',
}

export default Key
