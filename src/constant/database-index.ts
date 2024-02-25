import { IndexType } from '@typings'

const createIndex = <T extends Record<string, number>>(
  index: T
): IndexType<T> => {
  return index as IndexType<T>
}

const DATABASE_INDEX = {
  FEEDBACK: createIndex({
    bootcamp: 1,
    user: 1,
  }),
  USER: createIndex({
    username: 1,
    firstname: 1,
  }),
  BOOTCAMP: createIndex({
    averageRating: 1,
  }),
  COURSE: createIndex({
    duration: 1,
    tuition: 1,
  }),
}

export default DATABASE_INDEX
