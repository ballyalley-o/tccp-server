import { Schema, model }  from 'mongoose'
import { DATABASE_INDEX } from '@db'
import { MODULE_KEY }     from '@config/module.config'
import { PERMISSION }     from '@config/permission.config'
import Audit              from '@model/audit/Audit'

const TAG = MODULE_KEY.ROLE

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

RoleSchema.index(DATABASE_INDEX.ROLE)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
RoleSchema.add(Audit.obj)

const Role = model(TAG, RoleSchema)
export default Role
