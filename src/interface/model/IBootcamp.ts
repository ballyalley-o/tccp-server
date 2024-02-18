import { Schema } from 'mongoose'

interface IBootcamp {
  _id: Schema.Types.ObjectId
  name: string
  slug: string
  description: string
  website: string
  phone: string
  email: string
  address: string
  location: {
    type: string
    coordinates: [number | undefined, number | undefined]
    formattedAddress: string
    street: string
    city: string
    state: string
    zipcode: string
    country: string
  }
  careers: [string]
  duration: string
  averageRating: number
  averageCost: number
  photo: string
  housing: boolean
  jobAssistance: boolean
  jobGuarantee: boolean
  acceptGi: boolean
  createdAt: Date
  user: Schema.Types.ObjectId
}

export default IBootcamp
