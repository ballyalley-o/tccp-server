/// <reference types="jest" />
import { connect, clearDatabase, closeDatabase } from '../setup/mongo-memory'
import CourseQuiz                                from '../../model/CourseQuiz'
import CourseModule                              from '../../model/CourseModule'
import Course                                    from '../../model/Course'
import Bootcamp                                  from '../../model/Bootcamp'
import mongoose                                  from 'mongoose'

describe('CourseQuiz model', () => {
  beforeAll(async () => {
    await connect()
  })

  afterEach(async () => {
    await clearDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  test('creates quiz with default questions array and accepts questions', async () => {
    const userId = new mongoose.Types.ObjectId()
    const bootcamp = await Bootcamp.create({ name: 'QB', description: 'Long enough description for testing purposes', duration: '1', careers: ['Web Development'], user: userId } as any)
    const course = await Course.create({ title: 'CQ', slug: 'cq', description: 'Long enough description for testing purposes', duration: '1', tuition: 10, minimumSkill: 'beginner', bootcamp: bootcamp._id, user: userId } as any)
    const module = await CourseModule.create({ course: course._id, title: 'Mod', labelKey: 'course.module.mod' })

    const quiz = await CourseQuiz.create({ course: course._id, module: module._id, title: 'Quiz 1', labelKey: 'course.quiz.1' })
    expect(Array.isArray(quiz.questions)).toBe(true)
    expect(quiz.questions.length).toBe(0)

    const quiz2 = await CourseQuiz.create({ course: course._id, module: module._id, title: 'Quiz 2', labelKey: 'course.quiz.2', questions: [{ prompt: 'Q1', options: ['a','b'], answer: 0 }] })
    expect(quiz2.questions.length).toBe(1)
    expect(quiz2.questions[0].prompt).toBe('Q1')
  })
})
