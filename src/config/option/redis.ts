import GLOBAL            from '@config/global'
import type { Redis }    from 'ioredis'
import session           from 'express-session'
import * as connectRedis from 'connect-redis'
import redis             from '@config/redis.config'

const RedisStore = (connectRedis as any).RedisStore || (connectRedis as any).default || connectRedis

const redisStore = new RedisStore({ client: redis as Redis })
export const redisOption: session.SessionOptions = {
    store            : redisStore,
    secret           : GLOBAL.SESSION_SECRET || 'your-secret-key',
    resave           : false,
    saveUninitialized: false,
    cookie           : {
        secure  : GLOBAL.ENV === 'production',
        maxAge  : 1000 * 60 * 60 * 24,           // 24 hours
        httpOnly: true,
        sameSite: 'lax'
    }
}
