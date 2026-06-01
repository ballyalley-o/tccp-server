import GLOBAL from '@config/global'
import { Request, Response } from 'express'
import { use, LogRequest } from '@decorator'
import { Code } from '@constant/enum'
import packageJson from '../../../package.json' with { type: 'json' }

class SystemController {

  //@desc     System Information
  //@route    GET /system/info
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
  //@route    GET /system/health
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

    const statusCode = status === 'unhealthy' ? Code.INTERNAL_SERVER_ERROR : Code.OK

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

export default SystemController
