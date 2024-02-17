import 'colors'
import { App } from '@config'
// @datas
import userCollection from '@mock/user-collection'
// @models
import { User } from '@model'
import { COLOR } from '@constant/enum'
import logger from 'logger'
// import { logger } from '@middleware'
import { RESPONSE } from '@constant'
import { ARGV } from '@constant/enum'
import dotenv from 'dotenv'
dotenv.config()

const app = new App()

const seeder = async () => {
  try {
    await User.deleteMany()
    // await Role.deleteMany()
    // await Cohort.deleteMany()

    const createdUserCollection = await User.insertMany(userCollection)
    // const createdUsers = await User.insertMany(users)
    // const createdCohort = await Cohort.insertMany(cohort)
    // const createdModule = await Module.insertMany(module)

    logger.warn(RESPONSE.success.COLLECTION_SEED)
    process.exit()
  } catch (error: any) {
    logger.error(error.message)
    throw new Error(RESPONSE.error.FAILED_SEED)
  }
}

const destroy = async () => {
  try {
    await User.deleteMany()
    // await Role.deleteMany()
    // await Cohort.deleteMany()

    logger.custom(COLOR.BG_RED, RESPONSE.success.COLLECTION_DESTROYED)
    process.exit(1)
  } catch (error: any) {
    logger.error(error.message)
    throw new Error(RESPONSE.error.FAILED_DESTROY)
  }
}

if (process.argv[2] === ARGV.DESTROY) {
  destroy()
} else if (process.argv[2] === ARGV.SEED) {
  seeder()
}
