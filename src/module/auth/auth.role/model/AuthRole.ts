import { Schema, model }  from 'mongoose'
import { DATABASE_INDEX } from '@db'
import { MODULE_KEY }     from '@config/module.config'
import { PERMISSION }     from '@config/permission.config'

import AdminAudit         from '@module/admin/admin.audit/model/AdminAudit'

const TAG = MODULE_KEY.AUTH_ROLE

const AuthRoleSchema: Schema = new Schema<IAuthRole>(
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

AuthRoleSchema.index(DATABASE_INDEX.ROLE)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
AuthRoleSchema.add(AdminAudit.obj)

const AuthRole = model(TAG, AuthRoleSchema)
export default AuthRole
