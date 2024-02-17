import { Schema } from 'mongoose'

interface IDefault {
  createdBy: Schema.Types.ObjectId
  updatedBy: Schema.Types.ObjectId
  isArchived: boolean
  isActive: boolean
}

export default IDefault
