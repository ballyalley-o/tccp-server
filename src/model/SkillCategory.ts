import { Schema, model } from 'mongoose'
import { Key, SCHEMA }   from '@constant/enum'
import DefaultSchema     from './Default'

const TAG = Key.SkillCategory

export interface ISkillCategory {
  _id        ?: Schema.Types.ObjectId
  name        : string
  labelKey    : string
  description?: string
  slug        : string
  order       : number
}
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

SkillCategorySchema.index({ order: 1 })

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
SkillCategorySchema.add(DefaultSchema.obj)

const SkillCategory = model(TAG, SkillCategorySchema)
export default SkillCategory
