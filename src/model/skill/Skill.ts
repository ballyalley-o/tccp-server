import { Schema, model } from 'mongoose'
import { DATABASE_INDEX } from '@db'
import DefaultSchema     from '@model/default/Default'
import { Key, SCHEMA }   from '@constant/enum'

const TAG = Key.Skill

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
      ref     : Key.SkillCategory,
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

SkillSchema.pre(Key.Save, function (next) {
  this.slug = String(this.name).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '')
  next()
})

SkillSchema.index(DATABASE_INDEX.SKILL)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
SkillSchema.add(DefaultSchema.obj)

const Skill = model(TAG, SkillSchema)
export default Skill
