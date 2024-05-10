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

declare interface IPagination {
  next?: {
    page: number
    limit: number
  }
  prev?: {
    page: number
    limit: number
  }
}

declare interface IHTMLContent {
  (user: IUser, resetToken: string): string
}

declare interface IEmailOptions {
  email: string
  subject: string
  message?: string
  html?: string | IHTMLContent
}
