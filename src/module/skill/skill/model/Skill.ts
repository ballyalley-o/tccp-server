import { Schema, model }  from 'mongoose'
import { MODULE_KEY }     from '@config/module.config'
import { DATABASE_INDEX } from '@db'
import { SCHEMA }         from '@common/constant'

import AdminAudit from '@module/admin/admin.audit/model/AdminAudit'

const TAG = MODULE_KEY.SKILL

const SkillSchema = new Schema<ISkill>(
  {
    name: {
      type    : String,
      required: [true, SCHEMA.NAME],
      trim    : true,
      unique  : true
    },
    labelKey: {
      type    : String,
      required: [true, SCHEMA.NAME],
      trim    : true,
      unique  : true
    },
    description: {
      type   : String,
      trim   : true,
      default: ''
    },
    category: {
      type    : Schema.Types.ObjectId,
      ref     : MODULE_KEY.SKILL_CATEGORY,
      required: true,
      index   : true
    },
    slug: {
      type    : String,
      required: true,
      unique  : true,
      index   : true
    },
    order: {
      type   : Number,
      default: 0
    }
  },
  {
    timestamps: true,
    collection: TAG
  }
)

SkillSchema.pre('save', function (next) {
  this.slug = String(this.name).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '')
  next()
})

SkillSchema.index(DATABASE_INDEX.SKILL)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
SkillSchema.add(AdminAudit.obj)

const Skill = model(TAG, SkillSchema)
export default Skill
