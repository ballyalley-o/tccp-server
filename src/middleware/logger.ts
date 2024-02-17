import 'colors'
import ILogger from '@interface/logger'
import { Key } from '@constant/enum'

declare module 'colors' {
  interface String {
    yellow: string
    bgCyan: string
    bgRed: string
    red: string
    bgYellow: string
  }
}

const logger: ILogger = {
  // @type - custom
  custom: (color: any, ...message: string[]) =>
    console.log(message.join('')[color]),

  // @type - log :Default
  log: (...message: string[]) => console.log(message.join(' ').yellow),

  // @type - info
  info: (...message: string[]) => console.log(message.join(' ').bgCyan),

  // @type - warn
  warn: (...message: string[]) => console.warn(message.join(' ').bgYellow),

  // @type - table -for array and obj
  tbl: (...message: any[]) => console.table(message),

  // @type - error
  error: (...message: string[]) => console.log(message.join('').red.bold),

  // @type - debug
  debug: (...message: string[]) => console.debug(message.join(' ').bgRed),

  req: (req, res) => {
    console.log('')
    console.log(Key.ReqMethod.dim, req.method.yellow.bold)
    console.log(Key.ReqURL.dim, req.url.yellow.bold)
    console.log(Key.ReqTime.dim, new Date().toString().yellow.bold)
    console.log('')
  },

  /**
   *
   * @param port - server port
   * @param apiRoot - api version
   * @param isProd - send the status of the server environment
   * @param isConnected - send the status of the server connection
   * @return void
   */
  server: (port: any, apiRoot: any, isProd: boolean, isConnected: boolean) => {
    console.log(Key.ServerPort.bgYellow, port.yellow)
    console.log(Key.ServerAPIVersion.bgYellow, apiRoot.yellow)

    if (isProd) {
      console.log(Key.Environment.bgYellow, Key.Production.blue.bold)
    } else {
      console.log(Key.Environment.bgYellow, Key.Development.white.bold)
    }

    if (isConnected) {
      console.log(Key.ServerStatus.bgYellow, Key.Connected.green.bold)
    } else {
      console.log(Key.ServerStatus.bgYellow, Key.NotConnected.red.bold)
    }
  },

  // @preset - database
  db: (host: any, dbName: any, isConnected: boolean) => {
    const DB_LOG = [
      {
        HOST: host,
        DATABASE: dbName,
        STATUS: isConnected ? Key.Connected : Key.NotConnected,
      },
    ]
    console.table(DB_LOG)
  },
}

export default logger
