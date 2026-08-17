/// <reference types="jest" />
import { connect, clearDatabase, closeDatabase } from '../setup/mongo-memory'
import CourseModule                              from '../../model/course/module/CourseModule'
import Course                                    from '../../model/course/Course'
import Bootcamp                                  from '../../model/bootcamp/Bootcamp'
import mongoose                                  from 'mongoose'

describe('CourseModule model', () => {
  beforeAll(async () => {
    await connect()
  })

  afterEach(async () => {
    await clearDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  test('can create a module for a course', async () => {
    const userId = new mongoose.Types.ObjectId()
    const bootcamp = await Bootcamp.create({ name: 'B', description: 'Long enough description for testing purposes', duration: '1', careers: ['Web Development'], user: userId } as any)
    const course = await Course.create({ title: 'C1', slug: 'c1', description: 'Long enough description for testing purposes', duration: '1', tuition: 10, minimumSkill: 'beginner', bootcamp: bootcamp._id, user: userId, trainer: userId } as any)

    const module = await CourseModule.create({ course: course._id, title: 'Intro', labelKey: 'course.module.intro' })
    expect(String(module.course)).toBe(String(course._id))
    expect(module.title).toBe('Intro')
  })
})
