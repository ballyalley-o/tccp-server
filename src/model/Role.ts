import { Schema, model } from 'mongoose'

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
    // actions: list of actions this role can perform (e.g., 'create:user', 'create:role')
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

// attach default metadata fields (createdBy, updatedBy, isActive, isArchived) if available
import DefaultSchema from './Default'
// DefaultSchema is a mongoose Schema; use .obj to merge its definition into RoleSchema
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
RoleSchema.add(DefaultSchema.obj)

const Role = model(TAG, RoleSchema)
export default Role
