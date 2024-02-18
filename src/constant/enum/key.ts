enum Key {
  // @tag
  User = 'User',

  Cookie = 'cookie',
  Token = 'token',
  None = 'none',

  CryptoHash = 'sha256',
  // @error keys
  ObjectId = 'ObjectId',
  CastError = 'CastError',
  Connected = 'CONNECTED 🟢',
  NotConnected = 'NOT CONNECTED 🔴',
  Environment = 'ENVIRONMENT',
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
}

export default Key
