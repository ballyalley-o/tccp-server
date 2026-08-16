import path                               from 'path'
import { fileURLToPath }                  from 'url'
import express                            from 'express'
import type { Router, Request, Response } from 'express'
import GLOBAL                             from '@config/global.config'
import { PathDir }                        from '@route/dir'

const ENV:AppEnvType = 'production'
const __filename     = fileURLToPath(import.meta.url)
const __dirname      = path.dirname(__filename)

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
      this._router?.get(PathDir.API_ROOT, (_req: Request, res: Response) => {
        res.sendFile(path.join(__dirname,  '../public', 'index.api.html'))
      })
    } else {
      this._router?.get(PathDir.API_ROOT, (_req: Request, res: Response) => {
        res.sendFile(path.join(__dirname,  '../public', 'index.api.html'))
      })
    }
  }
}

export { AppRouter }
