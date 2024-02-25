import { IndexDirection } from 'mongoose'

// 1 = ascending, -1 = descending

const DATABASE_INDEX = {
  FEEDBACK: {
    bootcamp: 1,
    user: 1,
  } as Record<string, IndexDirection>,
}

export default DATABASE_INDEX
