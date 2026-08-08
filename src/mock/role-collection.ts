import ObjectID from 'bson-objectid'

const roleCollection = [
  {
    _id     : ObjectID('5c3b08ae6d663a3c4e8f3566'),
    name    : 'admin',
    label   : 'Administrator',
    metadata: { builtin: true },
    actions : [
      'create:user',
      'update:user',
      'delete:user',
      'create:role',
      'update:role',
      'delete:role',
      'manage:any'
    ]
  },
  {
    _id     : ObjectID('5c3b08ae6d663a3c4e8f3567'),
    name    : 'trainer',
    label   : 'Trainer',
    metadata: { builtin: true },
    actions : [
      'create:bootcamp',
      'update:bootcamp',
      'create:course',
      'update:course'
    ]
  },
  {
    _id     : ObjectID('5c3b08ae6d663a3c4e8f3568'),
    name    : 'student',
    label   : 'Student',
    metadata: { builtin: true },
    actions : []
  }
]

export default roleCollection
