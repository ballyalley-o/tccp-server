import GLOBAL                     from '@config/global.config'
import type { Request, Response } from 'express'
import { use, LogRequest }        from '@common/decorator'
import { Code }                   from '@common/constant/enum'
import packageJson                from '../../../../../package.json' with { type: 'json' }

class AdminSystemController {

  //@desc     System Information
  //@route    GET /admin/system/info
  //@access   PUBLIC
  @use(LogRequest)
  public static async getInfo(_req: Request, res: Response) {
    res.status(Code.OK).json({
      success: true,
      data: {
        name       : packageJson.name,
        version    : packageJson.version,
        apiVersion : GLOBAL.API_VERSION,
        environment: GLOBAL.ENV,
        nodeVersion: process.version,
        timestamp  : new Date().toISOString()
      }
    })
  }

  //@desc     Health Check
  //@route    GET /admin/system/health
  //@access   PUBLIC
  @use(LogRequest)
  public static async getHealth(_req: Request, res: Response) {
    const memory          = process.memoryUsage()
    const heapUsedPercent = (memory.heapUsed / memory.heapTotal) * 100
    let status = 'healthy'

    if (heapUsedPercent > 80) {
        status = 'degraded'
    }
    if (heapUsedPercent > 95) {
        status = 'unhealthy'
    }

    res.status(Code.OK).json({
      success: true,
      status,
      uptime : process.uptime(),
      checks: {
                memory : {
                    status,
                    usagePercent: Number(heapUsedPercent.toFixed(2))
            }
        }
    })
  }
}

export default AdminSystemController
