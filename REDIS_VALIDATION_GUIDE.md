# Redis Integration & Request Validation Guide

This document provides guidance on using the Redis integration and Zod request validation features added to the TCCP Server.

## Table of Contents
1. [Redis Setup](#redis-setup)
2. [Session Management](#session-management)
3. [Request Validation](#request-validation)
4. [Caching](#caching)
5. [Environment Configuration](#environment-configuration)

---

## Redis Setup

### Prerequisites
- Redis server running locally or remotely
- Docker (optional, for containerized setup)

### Local Setup

1. **Install Redis** (macOS with Homebrew):
   ```bash
   brew install redis
   ```

2. **Start Redis**:
   ```bash
   redis-server
   ```

3. **Verify Connection**:
   ```bash
   redis-cli ping
   # Expected output: PONG
   ```

### Docker Setup

Using the provided `docker-compose.yml`:

```bash
docker-compose up -d redis
```

This starts a Redis container on `localhost:6379` with persistent data storage.

### Environment Configuration

Update your `.env` file with Redis settings:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=          # Leave empty if no password
REDIS_DB=0              # Database number (0-15)
SESSION_SECRET=your-secure-session-secret-key-change-in-production
```

---

## Session Management

Sessions are now stored in Redis for better scalability and persistence across server restarts.

### How It Works

- Express sessions are stored in Redis instead of memory
- Sessions are automatically created for each client
- Session data persists across server restarts
- Default session TTL: 24 hours
- Cookies are secure (httpOnly, sameSite=lax)

### Configuration

Edit `src/config/server.ts` to modify session settings:

```typescript
this._app.use(session({
  store: redisStore,
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: this._env === Key.Production,  // HTTPS only in production
    maxAge: 1000 * 60 * 60 * 24,            // 24 hours
    httpOnly: true,
    sameSite: 'lax'
  }
}))
```

### Usage in Controllers

Access session data in your controllers:

```typescript
// Set session data
req.session.userId = user._id
req.session.email = user.email

// Get session data
const userId = req.session.userId

// Destroy session
req.session.destroy((err) => {
  if (err) console.error('Session destroy error:', err)
})
```

---

## Request Validation

Zod provides runtime schema validation for all incoming requests. This ensures type safety and data integrity.

### Available Schemas

Schemas are defined in `src/validation/schemas.ts`:

- **User Validation**:
  - `userRegisterSchema` - Registration request
  - `userLoginSchema` - Login request
  - `userUpdateSchema` - Profile updates

- **Bootcamp Validation**:
  - `bootcampCreateSchema` - Create bootcamp
  - `bootcampUpdateSchema` - Update bootcamp

- **Course Validation**:
  - `courseCreateSchema` - Create course
  - `courseUpdateSchema` - Update course

- **Query Validation**:
  - `paginationSchema` - Pagination parameters

### Using Validation Middleware

Apply validation to your routes:

```typescript
import { validate } from '@middleware'
import { userLoginSchema, bootcampCreateSchema } from '@validation/schemas'

// In your routes
router.post('/auth/login', validate(userLoginSchema), controller.login)
router.post('/bootcamps', validate(bootcampCreateSchema), controller.create)
```

### Validation Response Format

**Valid Request**:
```json
{
  "success": true,
  "data": {}
}
```

**Invalid Request**:
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "path": "body.email",
      "message": "Invalid email address"
    },
    {
      "path": "body.password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### Adding New Validation Schemas

1. **Define schema** in `src/validation/schemas.ts`:

```typescript
export const myFeatureSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    description: z.string().min(10, 'Description required'),
  }),
})

export type MyFeatureInput = z.infer<typeof myFeatureSchema>
```

2. **Use in route**:

```typescript
import { validate } from '@middleware'
import { myFeatureSchema } from '@validation/schemas'

router.post('/my-endpoint', validate(myFeatureSchema), controller.handler)
```

### Validation Best Practices

- ✅ Define schemas at the route level
- ✅ Include clear validation messages
- ✅ Use type inference for controllers
- ✅ Combine multiple schemas for complex requests
- ❌ Don't skip validation for "internal" endpoints

---

## Caching

Redis caching improves performance for frequently accessed data using TTL-based expiration.

### Cache Utility (`src/util/redis-cache.ts`)

#### Basic Operations

```typescript
import cache from '@util/redis-cache'

// Get from cache
const data = await cache.get<MyType>('key')

// Set in cache (default TTL: 5 minutes)
await cache.set('key', data)

// Set with custom TTL (in seconds)
await cache.set('key', data, 600) // 10 minutes

// Delete key
await cache.delete('key')

// Delete multiple keys
await cache.deleteMany(['key1', 'key2', 'key3'])

// Clear all cache
await cache.flush()
```

#### Using Cache Middleware

Apply to GET endpoints:

```typescript
import cache from '@util/redis-cache'

router.get('/bootcamps', cache.middleware('bootcamps', 300), controller.getAll)
```

#### Invalidating Cache

When updating data, invalidate related cache:

```typescript
// After updating bootcamp
await cache.delete(`bootcamps:${JSON.stringify({ query: {}, params: {} })}`)

// Or invalidate all bootcamp cache
const keys = await redis.keys('bootcamps:*')
await cache.deleteMany(keys)
```

### Cache Key Strategy

Cache keys are structured as:
```
{prefix}:{json_stringify({query, params})}
```

Example:
```
bootcamps:{"query":{"page":"1"},"params":{}}
```

### Cache Best Practices

- ✅ Cache GET requests only
- ✅ Use short TTL for frequently changing data (300-600s)
- ✅ Use long TTL for static data (3600-86400s)
- ✅ Invalidate cache on CREATE/UPDATE/DELETE
- ❌ Don't cache sensitive data
- ❌ Don't cache POST/PUT/DELETE responses

---

## Environment Configuration

### Required Variables

```env
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=              # Optional
REDIS_DB=0                   # Database number (0-15)
SESSION_SECRET=unique-secure-key
```

### Example `.env` for Development

```env
NODE_ENV=development
PORT=3003

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
SESSION_SECRET=dev-secret-change-in-production

# MongoDB
DB_URI=mongodb://localhost:27017/tccp-dev

# Other config...
```

### Example `.env` for Production

```env
NODE_ENV=production
PORT=3003

# Redis (remote)
REDIS_HOST=redis.example.com
REDIS_PORT=6380
REDIS_PASSWORD=secure-redis-password
REDIS_DB=0
SESSION_SECRET=long-secure-random-string

# MongoDB (Atlas)
DB_URI=mongodb+srv://user:pass@cluster.mongodb.net/tccp

# Other config...
```

---

## Testing

### Test Redis Connection

```bash
# In your app code
import redis from '@config/redis'

redis.ping().then(() => console.log('Redis connected!'))
```

### Test Session Storage

```bash
# Monitor Redis keys
redis-cli MONITOR

# In another terminal, make a request to your API
curl http://localhost:3003/api/...

# Check for session keys in Redis
redis-cli KEYS "sessions:*"
```

### Test Validation

```bash
# Valid request
curl -X POST http://localhost:3003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Invalid request (missing email)
curl -X POST http://localhost:3003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"password123"}'
# Response: 400 with validation errors
```

### Test Caching

```bash
# First request (cache miss)
curl http://localhost:3003/api/bootcamps

# Check cache
redis-cli GET "bootcamps:*"

# Second request (cache hit)
curl http://localhost:3003/api/bootcamps
```

---

## Troubleshooting

### "Redis connection refused"

**Problem**: Can't connect to Redis server

**Solutions**:
1. Verify Redis is running: `redis-cli ping`
2. Check Redis host/port in `.env`
3. Check firewall/network access
4. Restart Redis: `redis-cli shutdown` then `redis-server`

### "Session not persisting"

**Problem**: Sessions lost after server restart

**Solution**:
- Verify Redis is configured with persistence
- Check `appendonly yes` in Redis config
- Verify `SESSION_SECRET` is set

### "Validation not working"

**Problem**: Invalid data passes through

**Solutions**:
1. Ensure middleware is applied: `validate(schema)`
2. Check schema is correct in `src/validation/schemas.ts`
3. Verify middleware order (should be early in route chain)

### "Cache not working"

**Problem**: Data always fresh, cache miss

**Solutions**:
1. Verify Redis connection
2. Check cache TTL isn't 0
3. Ensure cache middleware is applied
4. Check Redis `KEYS` with `redis-cli`

---

## Migration Guide

### From In-Memory Cache

If migrating from the existing `MemoryCache`:

1. **Old way** (`src/util/cache.ts`):
```typescript
import { cache } from '@util/cache'
cache.set('key', value)
const data = cache.get('key')
```

2. **New way** (`src/util/redis-cache.ts`):
```typescript
import cache from '@util/redis-cache'
await cache.set('key', value)
const data = await cache.get('key')
```

Key differences:
- Now async (returns promises)
- Persists across server restarts
- Scales to multiple servers
- Automatic TTL expiration

---

## Performance Tips

1. **Use connection pooling** - ioredis handles this automatically
2. **Set appropriate TTLs** - Balance between freshness and performance
3. **Compress large values** - For very large cached objects
4. **Monitor Redis memory** - `redis-cli INFO memory`
5. **Use pipelines** - For bulk operations (implemented in cache.deleteMany)

---

## Security Best Practices

1. ✅ Always set `SESSION_SECRET` to a strong random value
2. ✅ Use HTTPS in production (`cookie.secure: true`)
3. ✅ Set Redis password in production
4. ✅ Use TLS for Redis connections in production
5. ✅ Validate all input data
6. ❌ Don't store sensitive data in cache
7. ❌ Don't expose Redis publicly

---

## Further Reading

- [ioredis Documentation](https://github.com/luin/ioredis)
- [Express-session Documentation](https://github.com/expressjs/session)
- [Zod Documentation](https://zod.dev/)
- [connect-redis](https://github.com/tj/connect-redis)
- [Redis Documentation](https://redis.io/docs/)
