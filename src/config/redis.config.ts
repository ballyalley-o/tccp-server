import Redis   from 'ioredis'
import goodlog from 'good-logs'

const redis = new Redis({
  host         : process.env.REDIS_HOST || 'localhost',
  port         : parseInt(process.env.REDIS_PORT || '6379', 10),
  password     : process.env.REDIS_PASSWORD,
  db           : parseInt(process.env.REDIS_DB || '0', 10),
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
  reconnectOnError: (err) => {
    const targetError = 'READONLY'
    if (err.message.includes(targetError)) {
      return true
    }
    return false
  },
})

redis.on('connect', () => {
  goodlog.log(' REDIS: '.grey, 'CONNECTED'.green)
})

redis.on('error', (err) => {
  goodlog.error(' REDIS: ', err.message)
})

export default redis
