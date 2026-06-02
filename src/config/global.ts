import path from 'path'
import fs from 'fs'
import { ObjectId } from 'mongoose'

import dotenv from 'dotenv'
dotenv.config()

const GLOBAL = {
  APP_NAME           : process.env.APP_NAME || 'TCC Projct',
  APP_SERVER_NAME    : 'tccp-server',
  API_HOST           : process.env.API_HOST || '',
  API_URL            : process.env.API_URL,
  CORS_ALLOWED_ORIGIN: process.env.CORS_ALLOWED_ORIGIN?.split(',') || [],
  API_VERSION        : process.env.API_VERSION || '',
  PORT               : process.env.PORT || 3005,
  ENV                : process.env.NODE_ENV || 'development',

  // jwt
  JWT_SECRET         : process.env.JWT_SECRET,
  JWT_EXP            : process.env.JWT_EXP,
  // @db
  DB_URI             : process.env.DB_URI,
  DB_HOST            : (db: any) => db.connection.host,
  DB_NAME            : (db: any) => db.connection.name,

  //@photo upload / avatar
  MAX_AVATAR_UPLOAD  : process.env.MAX_AVATAR_UPLOAD || 500000,
  MAX_FILE_UPLOAD    : process.env.MAX_FILE_UPLOAD || 1000000,
  PHOTO_UPLOAD_PATH  : process.env.PHOTO_UPLOAD_PATH,
  PHOTO_FILENAME     : (bootcampId: ObjectId, name: string) => `tccp-${bootcampId}${path.parse(name).ext}`,
  BADGE_FILENAME     : (bootcampId: ObjectId, name: string) => `tccp-b-${bootcampId}${path.parse(name).ext}`,
  AVATAR_FILENAME    : (userId: ObjectId, name: string) => `tccp-av-${userId}${path.parse(name).ext}`,

  // @file upload
  PHOTO_UPLOAD_MV    : (photo: any, bootcamp: IBootcamp, cb: any) => {
    fs.mkdirSync(`${process.env.FILE_UPLOAD_PATH}/${bootcamp._id}`, { recursive: true })
    photo.mv(`${process.env.FILE_UPLOAD_PATH}/${bootcamp._id}/${photo.name}`, cb)
  },
  BADGE_UPLOAD_MV    : (badge: any, bootcamp: IBootcamp, cb: any) => {
    fs.mkdirSync(`${process.env.BADGE_UPLOAD_PATH}/${bootcamp._id}`, { recursive: true })
    badge.mv(`${process.env.BADGE_UPLOAD_PATH}/${bootcamp._id}/${badge.name}`, cb)
  },
  AVATAR_UPLOAD_MV   : (avatar: any, user: IUser, cb: any) => {
    fs.mkdirSync(`${process.env.AVATAR_UPLOAD_PATH}/${user._id}`, { recursive: true })
    avatar.mv(`${process.env.AVATAR_UPLOAD_PATH}/${user._id}/${avatar.name}`, cb)
  },

  // @mail - nodemailer - mailtrap
  MAIL_FROM           : `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
  MAIL                : {
                          host: process.env.SMTP_HOST,
                          port: process.env.SMTP_PORT,
                          auth: {
                            user: process.env.SMTP_EMAIL,
                            pass: process.env.SMTP_PASSWORD
                          }
                        } as {  component?: string | undefined },
  // @limiter - rate limiter
  RATE_LIMIT          : 100,
  LIMITER             : {
                          windowMs: 10 * 60 * 1000, // ten min,
                          max: 100
                        },
  // @geocoder
  GEOCODER_PROVIDER   : process.env.GEOCODER_PROVIDER,
  GEOCODER_API_KEY    : process.env.GEOCODER_API_KEY
}

export default GLOBAL