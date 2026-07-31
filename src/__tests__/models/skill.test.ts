/// <reference types="jest" />
import { connect, clearDatabase, closeDatabase } from '../setup/mongo-memory'
import Skill                                     from '../../model/Skill'
import SkillCategory                             from '../../model/SkillCategory'

describe('Skill model', () => {
  beforeAll(async () => {
    await connect()
  })

  afterEach(async () => {
    await clearDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  test('pre-save should generate slug and store category reference', async () => {
    const cat = await SkillCategory.create({ name: 'Backend', labelKey: 'skills.backend', slug: 'backend' })
    const skill = await Skill.create({ name: 'Node JS', labelKey: 'skills.node', category: cat._id, slug: 'node-js' })

    expect(skill.slug).toBe('node-js')
    expect(String(skill.category)).toBe(String(cat._id))
  })
})
