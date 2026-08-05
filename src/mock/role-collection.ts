import ObjectID from 'bson-objectid'

const roleCollection = [
  {
    _id: ObjectID('5c3b08ae6d663a3c4e8f3566'),
    name: 'admin',
    label: 'Administrator',
    metadata: { builtin: true }
  },
  {
    _id: ObjectID('5c3b08ae6d663a3c4e8f3567'),
    name: 'trainer',
    label: 'Trainer',
    metadata: { builtin: true }
  },
  {
    _id: ObjectID('5c3b08ae6d663a3c4e8f3568'),
    name: 'student',
    label: 'Student',
    metadata: { builtin: true }
  }
]

export default roleCollection
