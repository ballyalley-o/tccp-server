import { Schema, model }  from 'mongoose'
import { DATABASE_INDEX } from '@db'
import { Default }        from '@model'
import { PERMISSION }     from '@constant'

const TAG = 'Role'

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
RoleSchema.add(Default.obj)

const Role = model(TAG, RoleSchema)
export default Role
