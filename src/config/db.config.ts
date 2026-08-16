import mongoose from 'mongoose'
import goodlog  from 'good-logs'
import GLOBAL   from '@config/global.config'

mongoose.set('strictQuery', true)

const connectDb = async (isConnected: boolean) => {
  try {
    const dbConnect = await mongoose.connect(String(GLOBAL.DB_URI), {
      maxPoolSize             : 10,
      minPoolSize             : 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS         : 45000
    })

    goodlog.db(
      GLOBAL.DB_HOST(dbConnect),
      dbConnect.connection.name,
      isConnected
    )

    return dbConnect
  } catch (error: any) {
    goodlog.error(error.message)
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      goodlog.info('MongoDB connection closed')
      process.exit(0)
    })

    process.on('SIGTERM', async () => {
      await mongoose.connection.close()
      goodlog.info('MongoDB connection closed')
      process.exit(0)
    })
  }
}

export default connectDb
