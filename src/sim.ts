import goodlog      from 'good-logs'
import App          from '@config/server'
import { RESPONSE } from '@common/constant'
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
import { AuthUser }      from '@module/auth/auth.user'
import { AuthRole }      from '@module/auth/auth.role'
import { Bootcamp }      from '@module/bootcamp'
import { Feedback }      from '@module/feedback'
import { Course }        from '@module/course'
import { CourseLecture } from '@module/course/course.lecture'
import { CourseModule }  from '@module/course/course.module'
import { CourseQuiz }    from '@module/course/course.quiz'
import { Skill }         from '@module/skill'
import { SkillCategory } from '@module/skill/skill.category'

const app = new App()
app.connectDb()

const seeder = async () => {
  try {
    await AuthRole.deleteMany()
    await AuthUser.deleteMany()
    await Course.deleteMany()
    await Bootcamp.deleteMany()
    await Feedback.deleteMany()
    await CourseLecture.deleteMany()
    await CourseModule.deleteMany()
    await CourseQuiz.deleteMany()
    await Skill.deleteMany()
    await SkillCategory.deleteMany()

    const createdRoles = await AuthRole.insertMany(roleCollection)
    const roleByName: Record<string, any> = {}

    createdRoles.forEach((r: any) => {
      roleByName[r.name] = r._id
    })

    const usersToInsert = userCollection.map((u: any) => ({
      ...u,
      role: typeof u.role === 'string' ? (roleByName[u.role] ?? u.role) : u.role
    }))

    await AuthUser.insertMany(usersToInsert)
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
    await AuthUser.deleteMany()
    await Course.deleteMany()
    await Bootcamp.deleteMany()
    await Feedback.deleteMany()
    await CourseLecture.deleteMany()
    await CourseModule.deleteMany()
    await CourseQuiz.deleteMany()
    await Skill.deleteMany()
    await SkillCategory.deleteMany()
    await AuthRole.deleteMany()

    goodlog.custom('bgRed', RESPONSE.success.COLLECTION_DESTROYED)
    process.exit(1)
  } catch (error: any) {
    goodlog.error(error.message)
    throw new Error(RESPONSE.error.FAILED_DESTROY)
  }
}

const ARGV = {
  SEED   : '-i',
  DESTROY: '-d',
} as const

if (process.argv[2] === ARGV.DESTROY) {
  destroy()
} else if (process.argv[2] === ARGV.SEED) {
  seeder()
}
