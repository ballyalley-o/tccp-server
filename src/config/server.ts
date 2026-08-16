import GLOBAL                                         from '@config/global.config'
import dotenv                                         from 'dotenv'
import express, { Application }                       from 'express'
import session                                        from 'express-session'
import nodemailer                                     from 'nodemailer'
import goodlog                                        from 'good-logs'
import cors                                           from 'cors'
import morgan                                         from 'morgan'
import NodeGeocoder                                   from 'node-geocoder'
import cookieParser                                   from 'cookie-parser'
import fileupload                                     from 'express-fileupload'
import mongoSanitize                                  from 'express-mongo-sanitize'
import helmet                                         from 'helmet'
import hpp                                            from 'hpp'
import rateLimit                                      from 'express-rate-limit'
import compression                                    from 'compression'
import connectDb                                      from '@config/db.config'
import { corsOption, compressionOption, redisOption } from '@config/option'
import { AppRouter }                                  from '@app-router'
import { mainRoute }                                  from '@route'
import { xssHandler, errorHandler, notFound }         from '@middleware'
import { LogInitRequest, ServerStatus }               from '@decorator'
import options                                        from '@util/geocoder'
import { ERROR }                                      from '@constant'

dotenv.config()

/**
 * @class App
 *
 * @description
 *    This class represents the application, it is responsible for initializing the app and starting the server.
 *    It also registers the routes.
 *
 * @returns void
 */
class App {
  private _app: Application
  private     _env     = GLOBAL.ENV
  isConnected: boolean = false

  public static globalConfig = GLOBAL
  public static transporter  = nodemailer.createTransport(GLOBAL.MAIL)
  public static geocoder     = NodeGeocoder(options(GLOBAL.GEOCODER_API_KEY || ''))
  public static message      = (options: any) => {
    return {
      from   : GLOBAL.MAIL_FROM,
      to     : options.email,
      subject: options.subject,
      text   : options.message,
      html   : options.html
    }
  }

  static app() {
    const app = new App()
    app.connectDb()
    app.start()
  }

        /**
   * Initialize the app and middlewares
   *
   * @param app
   * @param env - environment
   * @param port - port
   *
   * Constructor
   * @middleware
   * - express.json
   * - express.urlencoded
   * - express.static
   * - morgan
   * - cookieParser
   * - setHeader
   * - fileupload
   *
   * @security
   * - mongoSanitize
   * - helmet
   * - xssHandler
   * - hpp
   * - cors
   * - rateLimit
   *
   * @boundary
   * - errorHandler
   * - notFound
   *
   */
  constructor() {
    this._app = express()
    this._app.use(compression(compressionOption))
    this._app.use(express.json({ limit: GLOBAL.EXPRESS_MAX_BODY_SIZE }))
    this._app.use(express.urlencoded({ extended: true, limit: GLOBAL.EXPRESS_MAX_BODY_SIZE }))
    this._app.use(express.static('public'))
    this._app.use(morgan('combined'))
    this._app.use(cookieParser())
    this._app.use(session(redisOption))
    this._app.use(fileupload({ limits: { fileSize: 50 * 1024 * 1024 } }))
    this._app.use(cors(corsOption))
    this._app.use(mongoSanitize())
    this._app.use(helmet())
    this._app.use(xssHandler)
    this._app.use(rateLimit(GLOBAL.LIMITER))
    this._app.use(hpp())
    this.registerRoute()
    this._app.use(errorHandler)
    this._app.use(notFound)
  }

  /**
   * Register routes
   * @returns void
   */
  @LogInitRequest
  private registerRoute(): void {
    this._app.use(AppRouter.instance)
    AppRouter.serverRouter()
    mainRoute(this._app)
  }

        /**
   * Connects to the database.
   * @returns A promise that resolves when the database connection is established.
   */
  public async connectDb(): Promise<void> {
    try {
      await connectDb(true)
    } catch (error) {
      if (error instanceof Error) {
        goodlog.error(error.message)
        connectDb(false)
      }
    }
  }

        /**
   * Start the server
   * @returns void
   */
  @ServerStatus
  public start(): void {
    let prod: boolean = false
    if (this._env === 'production') {
      prod = true
    }

    try {
      this._app.listen(GLOBAL.PORT, () => {
        goodlog.server(GLOBAL.PORT as number, GLOBAL.API_VERSION, prod, this.isConnected)
      })
    } catch (error: any) {
      process.on(ERROR.UNHANDLED_REJECTION, (err) => {
        goodlog.server(GLOBAL.PORT as number, GLOBAL.API_VERSION, prod, this.isConnected)
        goodlog.error(error.message)
        this.isConnected = false
      })
    }
  }
}

export default App