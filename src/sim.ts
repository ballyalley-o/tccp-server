import goodlog      from 'good-logs'
import App          from '@config/server'
import { RESPONSE } from '@constant'
import { ARGV }     from '@constant/enum'
import {
  userCollection,
  feedbackCollection,
  bootcampCollection,
  courseCollection,
  courseLectureCollection,
  courseModuleCollection,
  courseQuizCollection,
  skillCollection,
  skillCategoryCollection,
  roleCollection
} from '@mock'
import {
  User,
  Course,
  Bootcamp,
  Feedback,
  CourseLecture,
  CourseModule,
  CourseQuiz,
  Skill,
  SkillCategory,
  Role
} from '@model'

const app = new App()
app.connectDb()

const seeder = async () => {
  try {
    await Role.deleteMany()
    await User.deleteMany()
    await Course.deleteMany()
    await Bootcamp.deleteMany()
    await Feedback.deleteMany()
    await CourseLecture.deleteMany()
    await CourseModule.deleteMany()
    await CourseQuiz.deleteMany()
    await Skill.deleteMany()
    await SkillCategory.deleteMany()

    const createdRoles = await Role.insertMany(roleCollection)
    const roleByName: Record<string, any> = {}

    createdRoles.forEach((r: any) => {
      roleByName[r.name] = r._id
    })

    const usersToInsert = userCollection.map((u: any) => ({
      ...u,
      role: typeof u.role === 'string' ? (roleByName[u.role] ?? u.role) : u.role
    }))

    await User.insertMany(usersToInsert)
    await Course.insertMany(courseCollection)
    await Bootcamp.insertMany(bootcampCollection)
    await Feedback.insertMany(feedbackCollection)
    await CourseLecture.insertMany(courseLectureCollection)
    await CourseModule.insertMany(courseModuleCollection)
    await CourseQuiz.insertMany(courseQuizCollection)
    await Skill.insertMany(skillCollection)
    await SkillCategory.insertMany(skillCategoryCollection)

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
    await CourseLecture.deleteMany()
    await CourseModule.deleteMany()
    await CourseQuiz.deleteMany()
    await Skill.deleteMany()
    await SkillCategory.deleteMany()
    await Role.deleteMany()

    goodlog.custom('bgRed', RESPONSE.success.COLLECTION_DESTROYED)
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
