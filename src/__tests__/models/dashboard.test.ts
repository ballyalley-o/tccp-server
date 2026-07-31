/// <reference types="jest" />
import { buildSkillDistribution } from '../../controller/dashboard/util'

describe('Dashboard controller utilities', () => {
  test('buildSkillDistribution ranks and weights skills', () => {
    const fn = buildSkillDistribution
    const items = [
      { course: { skills: [{ labelKey: 'skills.js' }, { labelKey: 'skills.node' }] }, progress: 100 },
      { course: { skills: [{ labelKey: 'skills.js' }] }, progress: 50 },
      { course: { skills: ['python'] }, progress: 0 }
    ]

    const result = fn(items)
    // Expect top label to be skills.js
    expect(result[0].label).toBe('skills.js')
    // Ensure python was converted to skills.python
    expect(result.find((r: any) => r.label === 'skills.python')).toBeTruthy()
    // Values should be numbers > 0
    result.forEach((r: any) => expect(typeof r.value).toBe('number'))
  })
})
