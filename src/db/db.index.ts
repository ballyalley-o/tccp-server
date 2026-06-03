

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
  })
}

export default DATABASE_INDEX
