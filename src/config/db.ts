import mongoose from 'mongoose'
import logger from 'logger'
import GLOBAL from '@config/global'

const connectDb = async (isConnected: boolean) => {
  try {
    const dbConnect = await mongoose.connect(String(GLOBAL.DB_URI))
    logger.db(GLOBAL.DB_HOST, dbConnect.connection.name, isConnected)
  } catch (error: any) {
    logger.error(error.message)
    process.exit()
  }
}

export default connectDb
