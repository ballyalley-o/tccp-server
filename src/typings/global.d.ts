
declare global {
  interface Pagination {
    next?: { page: number; limit: number }
    prev?: { page: number; limit: number }
  }

  interface AdvancedResults {
    success    : boolean
    message   ?: string
    count      : number
    pagination : Pagination
    data       : any[]
  }

  interface IPagination {
    next?: {
      page : number
      limit: number
    }
    prev?: {
      page : number
      limit: number
    }
  }

  interface IHTMLContent {
    (user: IUser, resetToken: string): string
  }

  interface IEmailOptions {
    email   : string
    subject : string
    message?: string
    html   ?: string | IHTMLContent
  }
}

export {}