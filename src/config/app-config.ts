import express, { Application } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import GLOBAL from '@config/global'
import { setHeader, connectDb } from '@config'
import { AppRouter } from '@app-router'
import { mainRoute } from '@route'
import { logger, errorHandler, notFound } from '@middleware'
import { LogInitRequest, ServerStatus } from '@decorator'
import { oneDay } from '@constant'

const TAG_env = 'production'

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
    this._app.use(cookieParser())
    this._app.use(setHeader)
    this._app.use(cors())
    this.registerRoute()
    this._app.use(notFound)
    this._app.use(errorHandler)
  }

  /**
   * Register routes
   * @returns void
   */
  @LogInitRequest
  private registerRoute() {
    // this._app.use(AppRouter.instance)
    mainRoute(this._app)
    AppRouter.serverRouter()
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
        logger.error(error.message)
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
        logger.server(GLOBAL.PORT, GLOBAL.API_VERSION, prod, this.isConnected)
      })
    } catch (error: any) {
      logger.server(GLOBAL.PORT, GLOBAL.API_VERSION, prod, this.isConnected)
      logger.error(error.message)
    }
  }
}

export default App
