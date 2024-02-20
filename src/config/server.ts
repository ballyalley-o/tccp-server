import GLOBAL from '@config/global'
import dotenv from 'dotenv'
dotenv.config()

import express, { Application } from 'express'
import nodemailer from 'nodemailer'
import goodlog from 'good-logs'
import cors from 'cors'
import morgan from 'morgan'
import NodeGeocoder from 'node-geocoder'
import cookieParser from 'cookie-parser'
import { setHeader, connectDb } from '@config'
import { AppRouter } from '@app-router'
import { mainRoute } from '@route'
import { errorHandler, notFound } from '@middleware'
import { LogInitRequest, ServerStatus } from '@decorator'
import { Key } from '@constant/enum'
import options from '@util/geocoder'
import '@controller/user'

// TODO: initialize this in the App class
export const globalConfig = GLOBAL
export const transporter = nodemailer.createTransport(GLOBAL.MAIL)
export const geocoder = NodeGeocoder(options(GLOBAL.GEOCODER_API_KEY || ''))
export const message = (options: any) => {
  return {
    from: GLOBAL.MAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
  }
}

const TAG_env = Key.Production

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
  private _env: string = GLOBAL.ENV
  isConnected: boolean = false

  static app() {
    const app = new App()
    app.connectDb()
    app.start()
  }

  /**
   * Initialize the app
   *
   * @param app
   * @param env - environment
   * @param port - port
   *
   * Constructor
   * @middlewares
   */
  constructor() {
    this._app = express()
    this._app.use(express.json())
    this._app.use(express.urlencoded({ extended: true }))
    this._app.use(express.static(Key.Public))
    this._app.use(morgan('short'))
    this._app.use(cookieParser())
    this._app.use(cors())
    this._app.use(setHeader)
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
    if (this._env === TAG_env) {
      prod = true
    }

    try {
      this._app.listen(GLOBAL.PORT, () => {
        goodlog.server(
          GLOBAL.PORT as number,
          GLOBAL.API_VERSION,
          prod,
          this.isConnected
        )
      })
    } catch (error: any) {
      goodlog.server(
        GLOBAL.PORT as number,
        GLOBAL.API_VERSION,
        prod,
        this.isConnected
      )
      goodlog.error(error.message)
    }
  }
}

export default App
