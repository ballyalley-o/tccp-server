import { Schema }     from 'mongoose'
import { MODULE_KEY } from '@config/module.config'

const AdminAuditSchema = new Schema<IAdminAudit>({
  createdBy: {
    type   : Schema.Types.ObjectId,
    ref    : MODULE_KEY.AUTH_USER,
    default: null
  },
  updatedBy: {
    type   : Schema.Types.ObjectId,
    ref    : MODULE_KEY.AUTH_USER,
    default: null
  },
  archivedBy: {
    type   : Schema.Types.ObjectId,
    ref    : MODULE_KEY.AUTH_USER,
    default: null
  },
  archivedAt: {
    type   : Date,
    default: null
  }
})

export default AdminAuditSchema
