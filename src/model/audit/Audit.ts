import { Schema }     from 'mongoose'
import { MODULE_KEY } from '@config'

const AuditSchema = new Schema<IAudit>({
  createdBy: {
    type   : Schema.Types.ObjectId,
    ref    : MODULE_KEY.USER,
    default: null
  },
  updatedBy: {
    type   : Schema.Types.ObjectId,
    ref    : MODULE_KEY.USER,
    default: null
  },
  archivedBy: {
    type   : Schema.Types.ObjectId,
    ref    : MODULE_KEY.USER,
    default: null
  },
  archivedAt: {
    type   : Date,
    default: null
  }
})

export default AuditSchema
