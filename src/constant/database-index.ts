import { IndexDirection } from 'mongoose'

// 1 = ascending, -1 = descending
// TODO: refactor
const DATABASE_INDEX = {
  FEEDBACK: {
    bootcamp: 1,
    user: 1,
  } as Record<string, IndexDirection>,
  USER: {
    username: 1,
    firstname: 1,
  } as Record<string, IndexDirection>,
  BOOTCAMP: {
    averageRating: 1,
  } as Record<string, IndexDirection>,
  COURSE: {
    duration: 1,
    tuition: 1,
  } as Record<string, IndexDirection>,
}

export default DATABASE_INDEX
