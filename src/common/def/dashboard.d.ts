declare global {
  type DashboardCountSummaryType = {
    users    : number
    trainers : number
    admins   : number
    bootcamps: number
    courses  : number
    feedback : number
  }

  type DashboardRecommendationType = {
    id    : string
    title : string
    meta  : string
    action: string
    path  : string
  }

  type DashboardCardType = {
    id      : string
    label   : string
    value   : string | number
    tone    : AppThemeType
    subtitle: string
  }

  type DashboardActionType = {
    id     : string
    icon   : string
    label  : string
    path   : string
    variant: AppVariantType
  }

  type DashboardCourseType = {
    id      : string
    title   : string
    meta    : string
    status  : string
    progress: number
    tone    : AppThemeType
    subtitle: string
  }

}
export {}