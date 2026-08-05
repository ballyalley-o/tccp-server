import goodlog                                                                      from 'good-logs'
import App                                                                          from '@config/server'
import { userCollection, feedbackCollection, bootcampCollection, courseCollection, roleCollection } from '@mock'
import { User, Course, Bootcamp, Feedback, Role }                                         from '@model'
import { COLOR }                                                                    from '@constant/enum'
import { RESPONSE }                                                                 from '@constant'
import { ARGV }                                                                     from '@constant/enum'

const app = new App()
app.connectDb()

const seeder = async () => {
  try {
    await Role.deleteMany()
    await User.deleteMany()
    await Course.deleteMany()
    await Bootcamp.deleteMany()
    await Feedback.deleteMany()

    // create roles first
    const createdRoles = await Role.insertMany(roleCollection)

    // map userCollection role (string) to role ObjectId
    const roleByName: Record<string, any> = {}
    createdRoles.forEach((r: any) => {
      roleByName[r.name] = r._id
    })

    const usersToInsert = userCollection.map((u: any) => ({
      ...u,
      role: typeof u.role === 'string' ? (roleByName[u.role] ?? u.role) : u.role
    }))

    const createdUserCollection = await User.insertMany(usersToInsert)
    const createdCourse         = await Course.insertMany(courseCollection)
    const createdBootcamp       = await Bootcamp.insertMany(bootcampCollection)
    const createdFeedback       = await Feedback.insertMany(feedbackCollection)

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
