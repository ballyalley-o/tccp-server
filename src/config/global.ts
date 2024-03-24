import { ObjectId } from 'mongoose'
import path from 'path'
import { conNex } from '@util'
import { oneDay, tenMin } from '@constant'
import { TransportOptions } from 'nodemailer'
import { NumKey } from '@constant/enum'
import dotenv from 'dotenv'
dotenv.config()

const GLOBAL = {
  APP_NAME: 'The CodeCoach Projct',
  APP_SERVER_NAME: 'tccp-server',
  API_HOST: conNex(process.env.API_HOST?.replace('{PORT}', process.env.PORT ?? '') || ''),
  API_URL: conNex(process.env.API_URL?.replace('{PORT}', process.env.PORT ?? '') || '', process.env.API_VERSION || ''),
  CLIENT_DEV_URL: conNex(process.env.API_HOST?.replace('{PORT}', process.env.DEV_CLIENT_PORT ?? '') || ''),
  CORS_ALLOWED_ORIGIN: process.env.CORS_ALLOWED_ORIGIN?.split(',') || [],
  API_VERSION: process.env.API_VERSION || '',
  PORT: process.env.PORT || 3005,
  ENV: process.env.NODE_ENV || '',
  // jwt
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXP: oneDay,
  // @db
  DB_URI: process.env.DB_URI,
  DB_HOST: (db: any) => db.connection.host,
  DB_NAME: (db: any) => db.connection.name,

  //@photo upload / avatar
  MAX_AVATAR_UPLOAD: process.env.MAX_AVATAR_UPLOAD || NumKey.FIVE_HUNDRED_KB,
  MAX_FILE_UPLOAD: process.env.MAX_FILE_UPLOAD || NumKey.ONE_MB,
  PHOTO_UPLOAD_PATH: process.env.PHOTO_UPLOAD_PATH,

  PHOTO_FILENAME: (bootcampId: ObjectId, name: string) => `tccp-${bootcampId}${path.parse(name).ext}`,
  AVATAR_FILENAME: (userId: ObjectId, name: string) => `tccp-av-${userId}${path.parse(name).ext}`,

  PHOTO_UPLOAD_MV: (photo: any, cb: any) => photo.mv(`${process.env.FILE_UPLOAD_PATH}/${photo.name}`, cb),
  AVATAR_UPLOAD_MV: (photo: any, cb: any) => photo.mv(`${process.env.AVATAR_UPLOAD_PATH}/${photo.name}`, cb),

  // @mail - nodemailer - mailtrap
  MAIL_FROM: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
  MAIL: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  } as TransportOptions,

  // @limiter - rate limiter
  RATE_LIMIT_WINDOW: tenMin,
  RATE_LIMIT: NumKey.RATE_LIMIT,
  LIMITER: {
    windowMs: tenMin,
    max: NumKey.RATE_LIMIT,
  },
  // @geocoder
  GEOCODER_PROVIDER: process.env.GEOCODER_PROVIDER,
  GEOCODER_API_KEY: process.env.GEOCODER_API_KEY,
}

export default GLOBAL
