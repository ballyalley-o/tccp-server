interface IPagination {
  next?: {
    page: number
    limit: number
  }
  prev?: {
    page: number
    limit: number
  }
}

export default IPagination
