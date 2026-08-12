import { Schema, model }  from 'mongoose'
import { DATABASE_INDEX } from '@db'
import DefaultSchema      from '@model/default/Default'
import { Key, SCHEMA }    from '@constant/enum'

const TAG = Key.SkillCategory

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

SkillCategorySchema.pre(Key.Save, function (next) {
  this.slug = String(this.name).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '')
  next()
})

SkillCategorySchema.index(DATABASE_INDEX.SKILL_CATEGORY)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
SkillCategorySchema.add(DefaultSchema.obj)

const SkillCategory = model(TAG, SkillCategorySchema)
export default SkillCategory
