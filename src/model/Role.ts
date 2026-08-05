import { Schema, model } from 'mongoose'
import { Key } from '@constant/enum'

const TAG = 'Role'

const RoleSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    label: {
      type: String
    },
    metadata: {
      type: Object,
      default: {}
    }
  },
  {
    collection: TAG,
    timestamps: true
  }
)

const Role = model(TAG, RoleSchema)
export default Role
