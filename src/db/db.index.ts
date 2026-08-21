

type MongoIndexValueType = 1 | -1 | '2dsphere' | 'text' | 'hashed'
type IndexType<T>        = { [K in keyof T]: MongoIndexValueType }

const createIndex = <T extends Record<string, MongoIndexValueType>>(index: T): IndexType<T> => {
  return index as IndexType<T>
}

const DATABASE_INDEX = {
  FEEDBACK: createIndex({
    bootcamp: 1,
    user    : 1
  }),
  USER: createIndex({
    email    : 1,
    username : 1,
    firstname: 1
  }),
  BOOTCAMP: createIndex({
    averageRating: 1,
    user         : 1,
    location     : '2dsphere'
  }),
  COURSE: createIndex({
    duration: 1,
    tuition : 1,
    bootcamp: 1,
    user    : 1
  }),
  COURSE_LECTURE: createIndex({
    course: 1,
    module: 1,
    order : 1
  }),
  COURSE_MODULE: createIndex({
    course: 1,
    order : 1
  }),
  COURSE_QUIZ: createIndex({
    course: 1,
    module: 1,
    order : 1
  }),
  COURSE_EVENT: {
    user: createIndex({
        user      : 1,
        occurredAt: -1
    }),
    course: createIndex({
        course    : 1,
        occurredAt: -1
    })
  },
  ENROLLMENT: {
    user       : createIndex({ user: 1, updatedAt: -1 }),
    user_course: createIndex({ user: 1, course: 1 }),
  },
  ROLE: createIndex({
    name: 1
  }),
  SKILL: createIndex({
    category: 1,
    order   : 1
  }),
  SKILL_CATEGORY: createIndex({
    order: 1
  })
}

export default DATABASE_INDEX
