import { Schema, model } from 'mongoose'
import DefaultSchema     from './Default'

const TAG = 'Role'



const RoleSchema: Schema = new Schema(
  {
    name: {
      type     : String,
      required : true,
      unique   : true,
      trim     : true,
      lowercase: true
    },
    label: {
      type: String
    },
    metadata: {
      type   : Object,
      default: {}
    },
    actions: {
      type   : [String],
      default: []
    }
  },
  {
    collection: TAG,
    timestamps: true
  }
)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
RoleSchema.add(DefaultSchema.obj)

const Role = model(TAG, RoleSchema)
export default Role
