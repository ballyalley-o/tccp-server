import express, { Router, Request, Response } from 'express'
import { GLOBAL } from '@config'
import { PathDir, RESPONSE } from '@constant'
import { Key } from '@constant/enum'

const ENV = Key.Production

class AppRouter {
  private static _router: Router

  static serverRouter() {
    if (GLOBAL.ENV === ENV) {
      this._router.use(express.static(PathDir.BUILD_LOC))
      this._router?.get('*', (req: Request, res: Response) =>
        res.sendFile(PathDir.BUILD_VIEW)
      )
    } else {
      this._router?.get(PathDir.API_ROOT, RESPONSE.server)
    }
  }
}

export { AppRouter }
