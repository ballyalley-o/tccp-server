enum Key {
  // @tag
  User = 'User',

  Cookie = 'cookie',
  // @error keys
  ObjectId = 'ObjectId',
  CastError = 'CastError',
  Connected = 'CONNECTED 🟢',
  NotConnected = 'NOT CONNECTED 🔴',
  Environment = 'ENVIRONMENT',
  Production = 'production',
  Development = 'development',

  // @logger - req
  ReqMethod = ' Request Method: ',
  ReqURL = ' Request URL: ',
  ReqTime = ' Request Time: ',
  // @logger - server
  ServerPort = ' SERVER PORT: ',
  ServerAPIVersion = ' API VERSION: ',
  ServerStatus = ' SERVER STATUS: ',
}

export default Key
