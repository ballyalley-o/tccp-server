import { Schema } from 'mongoose'
import { Key }    from '@constant'

interface IDefault {
  createdBy : Schema.Types.ObjectId
  updatedBy : Schema.Types.ObjectId
  isArchived: boolean
  archivedBy: Schema.Types.ObjectId
  archivedAt: Date
}

const DefaultSchema: Schema<IDefault> = new Schema<IDefault>({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref : Key.User
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref : Key.User
  },
  isArchived: {
    type   : Boolean,
    default: false
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
