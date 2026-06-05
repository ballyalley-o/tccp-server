import GLOBAL from '@config/global'
import type { Redis } from 'ioredis'
import session from 'express-session'
import { RedisStore } from 'connect-redis'
import redis          from '@config/redis.config'

const redisStore = new (RedisStore as any)({ client: redis as Redis })
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
