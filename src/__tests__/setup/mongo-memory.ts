import mongoose              from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

if (typeof jest !== 'undefined' && typeof jest.setTimeout === 'function') {
  jest.setTimeout(30000)
}

let mongoServer: MongoMemoryServer | null = null

export const connect = async () => {
        mongoServer = await MongoMemoryServer.create()
  const uri         = mongoServer.getUri()
  await mongoose.connect(uri, {})
}

export const closeDatabase = async () => {
  await mongoose.disconnect()
  if (mongoServer) await mongoServer.stop()
}

export const clearDatabase = async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany({})
  }
}
