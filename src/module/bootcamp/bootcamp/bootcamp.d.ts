import type { Types } from 'mongoose'

declare global {
    interface IBootcamp {
        _id        : Types.ObjectId
        name       : string
        slug       : string
        description: string
        website    : string
        phone      : string
        email      : string
        address    : string
        location   : {
            type            : string
            coordinates     : [number | undefined, number | undefined]
            formattedAddress: string
            street          : string
            city            : string
            state           : string
            zipcode         : string
            country         : string
        }
        careers      : string[]
        duration     : string
        averageCost  : number
        photo        : string
        badge        : string
        housing      : boolean
        jobAssistance: boolean
        jobGuarantee : boolean
        acceptGi     : boolean
        rating       : number
        totalFeedback: number
        feedback     : Types.ObjectId[]
        course       : Types.ObjectId
        user         : Types.ObjectId
    }

    interface IBootcampExtended extends IBootcamp {
        getTotalFeedback(bootcampId: Types.ObjectId): Promise<void>
    }
}

export {}