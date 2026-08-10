import { Schema, model }       from 'mongoose'
import { PERMISSION, type PermissionType } from '@constant'
import DefaultSchema           from './Default'

const TAG = 'Role'

export interface IRole {
  name    : string
  label   : string
  metadata: Record<string, any>
  actions : PermissionType[]
}

const RoleSchema: Schema = new Schema<IRole>(
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
      enum   : PERMISSION,
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
