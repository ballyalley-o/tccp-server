import goodlog from 'good-logs'
import { App } from '@config'
// @datas
import {
  userCollection,
  feedbackCollection,
  bootcampCollection,
  courseCollection,
} from '@mock'
// @models
import { User, Course, Bootcamp, Feedback } from '@model'
import { COLOR } from '@constant/enum'
import { RESPONSE } from '@constant'
import { ARGV } from '@constant/enum'

const app = new App()
app.connectDb()

const seeder = async () => {
  try {
    await User.deleteMany()
    await Course.deleteMany()
    await Bootcamp.deleteMany()
    await Feedback.deleteMany()

    const createdUserCollection = await User.insertMany(userCollection)
    const createdCourse = await Course.insertMany(courseCollection)
    const createdBootcamp = await Bootcamp.insertMany(bootcampCollection)
    const createdFeedback = await Feedback.insertMany(feedbackCollection)

    goodlog.warn(RESPONSE.success.COLLECTION_SEED)
    process.exit()
  } catch (error: any) {
    goodlog.error(error.message)
    throw new Error(RESPONSE.error.FAILED_SEED)
  }
}

const destroy = async () => {
  try {
    await User.deleteMany()
    await Course.deleteMany()
    await Bootcamp.deleteMany()
    await Feedback.deleteMany()

    goodlog.custom(COLOR.BG_RED, RESPONSE.success.COLLECTION_DESTROYED)
    process.exit(1)
  } catch (error: any) {
    goodlog.error(error.message)
    throw new Error(RESPONSE.error.FAILED_DESTROY)
  }
}

if (process.argv[2] === ARGV.DESTROY) {
  destroy()
} else if (process.argv[2] === ARGV.SEED) {
  seeder()
}
