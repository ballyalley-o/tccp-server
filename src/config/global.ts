import { conNex } from '@util'
import { oneDay } from '@constant'
import { ARGV } from '@constant/enum'
import dotenv from 'dotenv'
dotenv.config()

const GLOBAL = {
  APP_NAME: 'The CodeCoach Projct',
  APP_SERVER_NAME: 'tccp-server',
  API_URL: conNex(
    process.env.API_URL?.replace('{PORT}', process.env.PORT ?? '') || '',
    process.env.API_VERSION || ''
  ),
  API_VERSION: process.env.API_VERSION || '',
  PORT: Number(process.env.PORT) || 3005,
  ENV: process.env.NODE_ENV || '',
  // jwt
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXP: oneDay,
  // @db
  DB_URI: process.env.DB_URI,
  DB_HOST: (db: any) => db.connection.host,
  DB_NAME: (db: any) => db.connection.name,
}

export default GLOBAL
