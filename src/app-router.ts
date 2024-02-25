import express, { Router, Request, Response } from 'express'
import { GLOBAL } from '@config'
import { PathDir, RESPONSE } from '@constant'
import { Key, PathParam } from '@constant/enum'

const ENV = Key.Production

class AppRouter {
  private static _router: Router

  static get instance(): express.Router {
    if (!AppRouter._router) {
      AppRouter._router = express.Router()
    }

    return AppRouter._router
  }

  static serverRouter() {
    if (GLOBAL.ENV === ENV) {
      this._router.use(express.static(PathDir.BUILD_LOC))
      this._router?.get(PathParam.ALL, (req: Request, res: Response) =>
        res.sendFile(PathDir.BUILD_VIEW)
      )
    } else {
      this._router?.get(PathDir.API_ROOT, RESPONSE.server)
    }
  }
}

export { AppRouter }
