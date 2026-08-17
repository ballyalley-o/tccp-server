import type { Type }           from 'mongoose'
import type { UserStatusType } from '@constant/enum'


declare global {
    interface IUser extends IAudit {
        _id                                   ?: Types.ObjectId
        firstname                              : string
        lastname                               : string
        email                                  : string
        role                                   : Types.ObjectId
        password                               : string
        location                               : string
        username                               : string
        avatar                                 : string
        cohort                                 : Types.ObjectId
        progress                               : Types.ObjectId
        organization                          ?: string
        status                                 : UserStatusType
        deletedAt                              : Date
        deletedBy                              : Types.ObjectId
        deleteScheduledAt                      : Date
        resetPasswordToken                     : string
        resetPasswordExpire                    : Date
        tokenVersion                           : number
        getSignedJwtToken()                    : string
        getResetPasswordToken()                : string
        matchPassword(enteredPassword: string) : Promise<boolean>
    }
}

export { }