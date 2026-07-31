/// <reference types="jest" />
import { connect, clearDatabase, closeDatabase } from '../setup/mongo-memory'
import SkillCategory                             from '../../model/SkillCategory'

describe('SkillCategory model', () => {
  beforeAll(async () => {
    await connect()
  })

  afterEach(async () => {
    await clearDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  test('pre-save should generate slug from name', async () => {
    const cat = await SkillCategory.create({ name: 'Frontend Development', labelKey: 'skills.frontend', slug: 'frontend-development' })
    expect(cat.slug).toBe('frontend-development')
    expect(cat.name).toBe('Frontend Development')
  })
})
