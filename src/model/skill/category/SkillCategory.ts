import { Schema, model }  from 'mongoose'
import { MODULE_KEY }     from '@config/module'
import { DATABASE_INDEX } from '@db'
import { SCHEMA }         from '@constant/enum'
import Audit              from '@model/audit/Audit'

const TAG = MODULE_KEY.SKILL_CATEGORY

const SkillCategorySchema = new Schema<ISkillCategory>(
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

SkillCategorySchema.pre('save', function (next) {
  this.slug = String(this.name).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '')
  next()
})

SkillCategorySchema.index(DATABASE_INDEX.SKILL_CATEGORY)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
SkillCategorySchema.add(Audit.obj)

const SkillCategory = model(TAG, SkillCategorySchema)
export default SkillCategory
