import { IExpressController } from '@interface/middleware'

interface ILogger {
  /**
   * Custom log
   * @param message
   * @param color
   */
  custom(color: any, ...message: string[]): void

  /**
   * log message to console
   * @param message - message to log : default
   */
  log(...message: string[]): void

  /**
   * log message in type info
   * @param message - message to log : type info
   */
  info(...message: string[]): void

  /**
   * log message in type warn
   * @param message - message to log : type warn
   */
  warn(...message: string[]): void

  /**
   * log message in type array in a table
   * @param message - message to log : type array/object
   */
  tbl(...message: any[]): void

  /**
   * log message in type error
   * @param message - message to log : type error
   */
  error(...message: string[]): void

  /**
   * log message in type debug
   * @param message - message to log : type debug
   */
  debug(...message: string[]): void

  req: IExpressController

  /**
   *
   * @param port - server port
   * @param apiRoot - api version
   * @param isProd - send the status of the server environment
   * @param isConnected - send the status of the server connection
   */
  server(
    port: number,
    apiRoot: string,
    isProd: boolean,
    isConnected: boolean
  ): void

  /**
   * Preset log type for connection status update in the console
   * @param db - connection call
   * @param isConnected - send the status of the db connection
   */
  db(host: any, dbName: any, isConnected: boolean): void
}

export default ILogger
