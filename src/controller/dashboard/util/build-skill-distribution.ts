export function buildSkillDistribution(courseItems: Array<{ course?: any; progress?: number }>) {
  const valueMap = new Map<string, number>()

  courseItems.forEach((item) => {
    const course = item.course
    const skills = Array.isArray(course?.skills) ? course.skills : []
    const weight = typeof item.progress === 'number' && item.progress > 0 ? Math.max(1, Math.round((item.progress / 100) * 10)) : 1

    skills.forEach((skill: any) => {
      let label = 'skills.unknown'
      if (skill?.labelKey) {
        label = skill.labelKey
      } else if (skill?.id) {
        label = skill.id
      } else if (typeof skill === 'string') {
        label = `skills.${skill}`
      }

      const nextValue = (valueMap.get(label) ?? 0) + weight
      valueMap.set(label, nextValue)
    })
  })

  return Array.from(valueMap.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label, value }))
}
