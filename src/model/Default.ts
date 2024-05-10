import { Schema } from 'mongoose'
import { Key } from '@constant'

const DefaultSchema: Schema<IDefault> = new Schema<IDefault>({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: Key.User
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: Key.User
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isArchived: {
    type: Boolean,
    default: false
  }
})

// const Default = mongoose.model('Default', DefaultSchema)
export default DefaultSchema
