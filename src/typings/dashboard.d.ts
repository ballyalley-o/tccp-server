declare type DashboardAudienceType = 'guest' | 'user' | 'trainer' | 'admin'

declare type DashboardCountSummaryType = {
  users    : number
  trainers : number
  admins   : number
  bootcamps: number
  courses  : number
  feedback : number
}

declare type DashboardRecommendationType = {
  id    : string
  title : string
  meta  : string
  action: string
  path  : string
}

declare type DashboardCardType = {
  id      : string
  label   : string
  value   : string | number
  tone    : AppThemeType
  subtitle: string
}

declare type DashboardAction = {
  id     : string
  icon   : string
  label  : string
  path   : string
  variant: 'contained' | 'outlined' | 'text'
}

declare type DashboardCourse = {
  id      : string
  title   : string
  meta    : string
  status  : string
  progress: number
  tone    : AppThemeType
  subtitle: string
}
