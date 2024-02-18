import {
  IUser,
  IDefault,
  ICourse,
  ICourseExtended,
  IFeedback,
  IFeedbackExtended,
  IBootcamp,
} from '@interface/model'

export type Model =
  | IBootcamp
  | IUser
  | IDefault
  | ICourse
  | ICourseExtended
  | IFeedback
  | IFeedbackExtended
