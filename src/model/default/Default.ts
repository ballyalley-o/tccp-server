import { Schema } from 'mongoose'
import { Key }    from '@constant'

const DefaultSchema: Schema<IDefault> = new Schema<IDefault>({
  createdBy: {
    type   : Schema.Types.ObjectId,
    ref    : Key.User,
    default: null
  },
  updatedBy: {
    type   : Schema.Types.ObjectId,
    ref    : Key.User,
    default: null
  },
  archivedBy: {
    type   : Schema.Types.ObjectId,
    ref    : Key.User,
    default: null
  },
  archivedAt: {
    type   : Date,
    default: null
  }
})

export default DefaultSchema
