declare type Model = IBootcamp | IUser | IDefault | ICourse | ICourseExtended | IFeedback | IFeedbackExtended

declare interface Pagination {
  next?: { page: number; limit: number }
  prev?: { page: number; limit: number }
}

declare interface AdvancedResults {
  success: boolean
  message?: string
  count: number
  pagination: Pagination
  data: any[]
}
