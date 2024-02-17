import express, { Application } from 'express'
import GLOBAL from '@config/global'
import { logger, errorHandler, notFound } from '@middleware'
import { LogInitRequest, ServerStatus } from '@decorator'
import { oneDay } from '@constant'
import '@controllers/auth'
import '@controllers/core'

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
    return new App().start()
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
    // this._app.use(
    //   cookieSession({
    //     name: 'bobbi-session',
    //     keys: ['key1'],
    //     maxAge: oneDay,
    //   })
    // )
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
    // AppRouter.serverRouter()
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
