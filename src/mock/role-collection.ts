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
      'delete:bootcamp',
      'create:course',
      'update:course',
      'delete:course',
      'create:skill',
      'update:skill',
      'delete:skill',
      'create:skill-category',
      'update:skill-category',
      'delete:skill-category',
      'create:course-module',
      'update:course-module',
      'delete:course-module',
      'create:course-lecture',
      'update:course-lecture',
      'delete:course-lecture',
      'create:course-quiz',
      'update:course-quiz',
      'delete:course-quiz'
    ]
  },
  {
    _id     : ObjectID('5c3b08ae6d663a3c4e8f3568'),
    name    : 'student',
    label   : 'Student',
    metadata: { builtin: true },
    actions : [
      'create:enrollment',
      'update:enrollment',
      'delete:enrollment',
      'create:feedback',
      'update:feedback',
      'delete:feedback'
    ]
  }
]

export default roleCollection
