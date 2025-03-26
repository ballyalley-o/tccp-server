import path from 'path'
import { fileURLToPath } from 'url'
import express, { Router, Request, Response } from 'express'
import { GLOBAL } from '@config'
import { PathDir, RESPONSE } from '@constant'
import { Key, PathParam } from '@constant/enum'

const ENV = Key.Production
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
      this._router?.get(PathDir.API_ROOT, (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, 'public', 'index.api.html'))
      })
    } else {
      this._router?.get(PathDir.API_ROOT, (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, 'public', 'index.api.html'))
      })
    }
  }
}

export { AppRouter }
