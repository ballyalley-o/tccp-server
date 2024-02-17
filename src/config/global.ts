import { conNex } from '@util'
import dotenv from 'dotenv'
dotenv.config()

const GLOBAL = {
  APP_NAME: 'Bobbi',
  APP_SERVER_NAME: 'bobbi-server',
  API_URL: conNex(
    process.env.API_URL?.replace('{PORT}', process.env.PORT ?? '') || '',
    process.env.API_VERSION || ''
  ),
  API_VERSION: process.env.API_VERSION || '',
  PORT: process.env.PORT || '',
  ENV: process.env.NODE_ENV || '',
}

export default GLOBAL
