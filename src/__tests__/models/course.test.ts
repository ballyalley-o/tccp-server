/// <reference types="jest" />
import mongoose                                  from 'mongoose'
import { connect, clearDatabase, closeDatabase } from '../setup/mongo-memory'
import Course                                    from '../../module/course/course/model/Course'
import Bootcamp                                  from '../../module/bootcamp/bootcamp/model/Bootcamp'

describe('Course model', () => {
  beforeAll(async () => {
    await connect()
  })

  afterEach(async () => {
    await clearDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  test('getAverageCost should update bootcamp.averageCost', async () => {
    const userId = new mongoose.Types.ObjectId()
    const bootcamp = await Bootcamp.create({
      name       : 'Test Bootcamp',
      description: 'A test bootcamp that is longer than twenty chars',
      duration   : '4 weeks',
      careers    : ['Web Development'],
      user       : userId
    } as any)

    await Course.create({ title: 'Course A', slug: 'course-a', description: 'This course has enough chars to be valid', duration: '2 weeks', tuition: 100, minimumSkill: 'beginner', bootcamp: bootcamp._id, user: userId, trainer: userId } as any)
    await Course.create({ title: 'Course B', slug: 'course-b', description: 'This course has enough chars to be valid', duration: '3 weeks', tuition: 200, minimumSkill: 'beginner', bootcamp: bootcamp._id, user: userId, trainer: userId } as any)

    // call static method
    await (Course as any).getAverageCost(bootcamp._id)

    const updated = await Bootcamp.findById(bootcamp._id).lean()
    expect(updated).toBeTruthy()
    // average of 100 and 200 is 150, function rounds to nearest 10 (ceil)
    expect(updated!.averageCost).toBe(150)
  })
})
