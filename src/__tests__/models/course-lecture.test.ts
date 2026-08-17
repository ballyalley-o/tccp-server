/// <reference types="jest" />
import { connect, clearDatabase, closeDatabase } from '../setup/mongo-memory'
import CourseLecture                             from '../../model/course/lecture/CourseLecture'
import CourseModule                              from '../../model/course/module/CourseModule'
import Course                                    from '../../model/course/Course'
import Bootcamp                                  from '../../model/bootcamp/Bootcamp'
import mongoose                                  from 'mongoose'

describe('CourseLecture model', () => {
  beforeAll(async () => {
    await connect()
  })

  afterEach(async () => {
    await clearDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  test('creates lecture with defaults', async () => {
    const userId   = new mongoose.Types.ObjectId()
    const bootcamp = await Bootcamp.create({ name: 'B2', description: 'Long enough description for testing purposes', duration: '1', careers: ['Web Development'], user: userId } as any)
    const course   = await Course.create({ title: 'C2', slug: 'c2', description: 'Long enough description for testing purposes', duration: '1', tuition: 10, minimumSkill: 'beginner', bootcamp: bootcamp._id, user: userId, trainer: userId } as any)
    const module   = await CourseModule.create({ course: course._id, title: 'Intro', labelKey: 'course.module.intro', })

    const lecture = await CourseLecture.create({ course: course._id, module: module._id, title: 'L1', labelKey: 'course.lecture.l1' })
    expect(lecture.resources).toEqual([])
    expect(lecture.durationMinutes).toBe(0)
    expect(lecture.title).toBe('L1')
  })
})
