import mongoose from 'mongoose'
import goodlog from 'good-logs'
import GLOBAL from '@config/global'

const connectDb = async (isConnected: boolean) => {
  try {
    const dbConnect = await mongoose.connect(String(GLOBAL.DB_URI), {
      maxPoolSize: 10,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      socketKeepAliveMS: 10000,
    })
    goodlog.db(
      GLOBAL.DB_HOST(dbConnect),
      dbConnect.connection.name,
      isConnected
    )
  } catch (error: any) {
    goodlog.error(error.message)
    process.exit()
  }
}

export default connectDb
